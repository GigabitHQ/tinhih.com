import { test, beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import type { AddressInfo } from "node:net";
import { cleantalkCheck, spamMetaFromRequest, SPAM_REFUSAL } from "./cleantalk";

// Local mock of the CleanTalk API (no real network).
let mode: "allow" | "block" | "500" | "slow" | "badjson" = "allow";
const received: any[] = [];
const server = http.createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    received.push(JSON.parse(body));
    if (mode === "500") { res.statusCode = 500; return res.end("boom"); }
    if (mode === "badjson") return res.end("<html>");
    if (mode === "slow") return; // never answers -> client timeout
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ allow: mode === "block" ? 0 : 1, comment: "mock" }));
  });
});
await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api2.0`;

beforeEach(() => {
  received.length = 0;
  mode = "allow";
  process.env.CLEANTALK_API_URL = url;
  process.env.CLEANTALK_ACCESS_KEY = "test-key";
});
after(() => { server.closeAllConnections?.(); server.close(); });

const meta = { ip: "203.0.113.9", email: "a@example.com", name: "Ann Lee", userAgent: "UA", referer: "https://tinhih.com/x" };

test("key unset => skipped, no request", async () => {
  delete process.env.CLEANTALK_ACCESS_KEY;
  const v = await cleantalkCheck(meta);
  assert.equal(v.allowed, true);
  assert.equal(v.skipped, true);
  assert.equal(received.length, 0);
});

test("allow=1 => passes", async () => {
  const v = await cleantalkCheck(meta);
  assert.deepEqual(v, { allowed: true });
  assert.equal(received.length, 1);
  assert.equal(received[0].auth_key, "test-key");
  assert.equal(received[0].agent, "custom-tinhih-1.0");
  assert.equal(received[0].sender_ip, "203.0.113.9");
  assert.equal(received[0].sender_email, "a@example.com");
  assert.equal(received[0].sender_nickname, "Ann Lee");
});

test("allow=0 => blocked", async () => {
  mode = "block";
  const v = await cleantalkCheck(meta);
  assert.equal(v.allowed, false);
  assert.ok(SPAM_REFUSAL.includes("support@tinhih.com"));
});

test("HTTP 500 and bad JSON => fail open", async () => {
  mode = "500";
  assert.equal((await cleantalkCheck(meta)).allowed, true);
  mode = "badjson";
  assert.equal((await cleantalkCheck(meta)).allowed, true);
});

test("timeout => fail open (within ~4s)", async () => {
  mode = "slow";
  const t = Date.now();
  const v = await cleantalkCheck(meta);
  assert.equal(v.allowed, true);
  assert.equal(v.skipped, true);
  assert.ok(Date.now() - t < 6000);
});

test("no typed text is ever sent; IP from x-forwarded-for first hop", async () => {
  const req: any = { headers: { "x-forwarded-for": "198.51.100.7, 10.0.0.1", "user-agent": "UA", referer: "https://tinhih.com/book" }, ip: "10.0.0.1" };
  const m = spamMetaFromRequest(req, { email: "a@example.com", firstName: "Ann", lastName: "Lee", message: "private health details", notes: "x" } as any);
  assert.equal(m.ip, "198.51.100.7");
  await cleantalkCheck(m);
  assert.equal(received[0].message, undefined);
  assert.ok(!JSON.stringify(received[0]).includes("private health"));
});
