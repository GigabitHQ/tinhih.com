import type { Request } from "express";

/**
 * CleanTalk spam check (https://cleantalk.org/help/api-check-message) for the PUBLIC, anonymous submission endpoints
 * (self-registration, public booking requests). Run it after validation and before anything is stored or emailed.
 * - Off unless CLEANTALK_ACCESS_KEY is set (runtime variable). CLEANTALK_API_URL overrides the endpoint (tests only).
 * - Fail open: a timeout, an HTTP error or an unexpected answer lets the submission through. Only `allow == 0` blocks.
 * - Data minimisation: this is a health/appointment app, so NO typed text (message, notes, reason) is ever sent. CleanTalk only gets
 *   the sender's IP, email, name and the browser's user agent / referer.
 */
const endpoint = () => process.env.CLEANTALK_API_URL || "https://moderate.cleantalk.org/api2.0";
const TIMEOUT_MS = 4000;

export const SPAM_REFUSAL =
  "We could not accept this submission automatically. Please contact us at support@tinhih.com and we will help you directly.";

export interface SpamVerdict {
  allowed: boolean;
  skipped?: boolean;
  reason?: string;
}

export interface SpamMeta {
  ip?: string;
  email?: string;
  name?: string;
  userAgent?: string;
  referer?: string;
}

const str = (v: unknown, max: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined);

export function clientIp(req: Request): string | undefined {
  const fwd = req.headers["x-forwarded-for"];
  const first = (Array.isArray(fwd) ? fwd[0] : fwd)?.split(",")[0]?.trim();
  return first || req.ip || req.socket?.remoteAddress || undefined;
}

/** Build the check metadata from a request. Never includes any free text. */
export function spamMetaFromRequest(req: Request, who: { email?: unknown; firstName?: unknown; lastName?: unknown }): SpamMeta {
  const name = [str(who.firstName, 100), str(who.lastName, 100)].filter(Boolean).join(" ");
  return {
    ip: clientIp(req),
    email: str(who.email, 254),
    name: name || undefined,
    userAgent: str(req.headers["user-agent"], 300),
    referer: str(req.headers["referer"], 300),
  };
}

export async function cleantalkCheck(meta: SpamMeta): Promise<SpamVerdict> {
  const key = process.env.CLEANTALK_ACCESS_KEY;
  if (!key) return { allowed: true, skipped: true };
  try {
    const res = await fetch(endpoint(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        method_name: "check_message",
        auth_key: key,
        agent: "custom-tinhih-1.0",
        sender_ip: meta.ip || undefined,
        sender_email: meta.email || undefined,
        sender_nickname: meta.name || undefined,
        sender_info: JSON.stringify({ REFERRER: meta.referer, USER_AGENT: meta.userAgent }),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return { allowed: true, skipped: true, reason: `CleanTalk HTTP ${res.status}` };
    const j = (await res.json()) as { allow?: number | string; comment?: string };
    if (Number(j.allow) === 0) return { allowed: false, reason: String(j.comment ?? "blocked").slice(0, 200) };
    return { allowed: true };
  } catch (e) {
    return { allowed: true, skipped: true, reason: `CleanTalk unavailable: ${(e as Error).message.slice(0, 100)}` };
  }
}
