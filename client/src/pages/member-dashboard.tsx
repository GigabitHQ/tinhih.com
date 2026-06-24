import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { usePageTitle } from "@/context/page-context";
import { format } from "date-fns";
import {
  Quote,
  Calendar,
  Heart,
  Users,
  TrendingUp,
  ExternalLink,
  Clock,
  Crown,
  Gift,
  ShoppingBag,
  Star,
  Award
} from "lucide-react";
import { DonationDialog } from "@/components/donation/donation-dialog";
import { MemberLayout } from "@/components/layout/member-layout";
import { PremiumStatCard } from "@/components/premium-stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useMemberStore, useEventStore, useQuoteStore } from "@/store";
import { Link } from "wouter";

export default function MemberDashboard() {
  const { toast } = useToast();
  const { setPageInfo } = usePageTitle();

  // Store hooks
  const {
    profile,
    stats,
    isLoading: memberLoading,
    error: memberError,
    fetchProfile,
    fetchStats
  } = useMemberStore();

  const {
    upcomingEvents,
    isLoading: eventsLoading,
    error: eventsError,
    fetchEvents
  } = useEventStore();

  const {
    currentQuote,
    isLoading: quotesLoading,
    error: quotesError,
    fetchQuotes
  } = useQuoteStore();

  useEffect(() => {
    setPageInfo("Premium Member Dashboard", "Welcome to the TiNHiH Community");
  }, [setPageInfo]);

  useEffect(() => {
    fetchProfile();
    fetchStats();
    fetchEvents();
    fetchQuotes();
  }, [fetchProfile, fetchStats, fetchEvents, fetchQuotes]);

  // Handle errors
  useEffect(() => {
    if (memberError) {
      toast({
        title: "Error",
        description: memberError,
        variant: "destructive",
      });
    }
  }, [memberError, toast]);

  useEffect(() => {
    if (eventsError) {
      toast({
        title: "Error",
        description: eventsError,
        variant: "destructive",
      });
    }
  }, [eventsError, toast]);

  useEffect(() => {
    if (quotesError) {
      toast({
        title: "Error",
        description: quotesError,
        variant: "destructive",
      });
    }
  }, [quotesError, toast]);

  const isLoading = memberLoading || eventsLoading || quotesLoading;

  if (isLoading) {
    return (
      <MemberLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
          <span className="ml-2 text-muted-foreground">Loading your premium dashboard...</span>
        </div>
      </MemberLayout>
    );
  }

  // Calculate member stats
  const eventsAttended = stats?.eventsAttended || 0;
  const totalDonations = stats?.totalDonations || 0; // This is the amount, not count
  const productsPurchased = stats?.productsPurchased || 0;
  const daysAsMember = stats?.daysAsMember || 0;

  // Debug logging
  console.log('Member dashboard stats:', stats);
  console.log('Products purchased:', productsPurchased);

  return (
    <MemberLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center py-8 sm:py-12 bg-card rounded-2xl border border-border">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 rounded-full bg-muted shadow-sm">
              <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-foreground" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              Welcome to TiNHiH Community
            </h1>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto px-4">
            Your support makes healthcare better for everyone. Thank you for being part of our community.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 px-4">
            <Button
              className="font-semibold px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto"
              onClick={() => window.location.href = '/store'}
            >
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Visit Store
            </Button>
            <DonationDialog>
              <Button
                variant="outline"
                className="font-semibold px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto"
              >
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Make a Donation
              </Button>
            </DonationDialog>
          </div>
        </div>

        {/* Premium Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PremiumStatCard
            icon={Users}
            number={eventsAttended}
            label="Events Attended"
            subtext="This Month"
            gradient="bg-muted"
            delay={0}
          />

          <PremiumStatCard
            icon={Heart}
            number={totalDonations}
            label="Total Donations"
            prefix="$"
            subtext="This Year"
            gradient="bg-muted"
            delay={200}
          />

          <PremiumStatCard
            icon={ShoppingBag}
            number={productsPurchased}
            label="Products Purchased"
            subtext="Member Discount"
            gradient="bg-muted"
            delay={400}
          />

          <PremiumStatCard
            icon={Crown}
            number={daysAsMember}
            label="Days as Member"
            suffix="days"
            subtext="Premium Status"
            gradient="bg-muted"
            delay={600}
          />
        </div>

        {/* Featured Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inspirational Quote */}
          {currentQuote && (
            <Card className="shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-muted">
                    <Quote className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span>Today's Inspiration</span>
                  {currentQuote.isFeatured && (
                    <Badge variant="secondary" className="font-semibold">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="text-xl italic text-foreground mb-6 leading-relaxed">
                  "{currentQuote.text}"
                </blockquote>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-foreground">
                    — {currentQuote.author}
                  </p>
                  <StatusBadge status={currentQuote.category} showIcon={false} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Events */}
          <Card className="shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-muted">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <span>Upcoming Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents
                    .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                    .slice(0, 3)
                    .map((event: any) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-foreground/30 transition-all duration-200">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-foreground">{event.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{event.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{format(new Date(event.startDate), "MMM dd, yyyy 'at' h:mm a")}</span>
                            </div>
                            {event.location && (
                              <span className="flex items-center space-x-1">
                                <span>📍</span>
                                <span>{event.location}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    ))}
                  <Button
                    variant="outline"
                    className="w-full font-semibold"
                    onClick={() => window.location.href = '/member/events'}
                  >
                    View All Events
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">No upcoming events at the moment</p>
                  <p className="text-sm text-muted-foreground mt-2">Check back soon for new community events!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-sm bg-muted">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-muted">
                <Award className="h-5 w-5 text-muted-foreground" />
              </div>
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-auto p-6 flex flex-col items-center gap-3 border-border hover:bg-accent transition-all duration-200"
                onClick={() => window.location.href = '/store'}
              >
                <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                <span className="font-semibold">Visit Store</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-6 flex flex-col items-center gap-3 border-border hover:bg-accent transition-all duration-200"
                onClick={() => window.location.href = '/member/events'}
              >
                <Calendar className="h-6 w-6 text-muted-foreground" />
                <span className="font-semibold">View Events</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-6 flex flex-col items-center gap-3 border-border hover:bg-accent transition-all duration-200"
                onClick={() => window.location.href = '/member/quotes'}
              >
                <Quote className="h-6 w-6 text-muted-foreground" />
                <span className="font-semibold">Read Quotes</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-6 flex flex-col items-center gap-3 border-border hover:bg-accent transition-all duration-200"
                onClick={() => window.location.href = '/member/profile'}
              >
                <Users className="h-6 w-6 text-muted-foreground" />
                <span className="font-semibold">My Profile</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Support Community Section */}
        <Card className="shadow-sm bg-muted">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 rounded-full bg-card shadow-sm">
                  <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-foreground" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">Support Our Community</h3>
              </div>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                Your donation helps us provide better healthcare services and support our community initiatives.
                Every contribution makes a difference.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 px-4">
                <DonationDialog>
                  <Button className="font-semibold px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto">
                    <Heart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Make a Donation
                  </Button>
                </DonationDialog>
                <Link href="/store"
                  className="flex items-center justify-center rounded border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground font-semibold px-6 sm:px-8 py-2 transition-all duration-200 w-full sm:w-auto"
                >
                  <Gift className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Visit Store
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MemberLayout>
  );
}
