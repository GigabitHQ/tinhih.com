import { useState, useEffect } from "react";
import { MemberLayout } from "@/components/layout/member-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { usePageTitle } from "@/context/page-context";
import { format } from "date-fns";
import { Heart, DollarSign, Calendar, TrendingUp, Gift, Receipt } from "lucide-react";
import { DonationDialog } from "@/components/donation/donation-dialog";
import { useAuth } from "@/context/auth-context";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatCard } from "@/components/ui/stat-card";

interface Donation {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  message?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isAnonymous: boolean;
  paymentMethod?: string;
  receiptUrl?: string;
  createdAt: string;
  donor?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function MemberDonations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    thisMonth: 0,
    thisYear: 0
  });
  const { toast } = useToast();
  const { setPageInfo } = usePageTitle();
  const { user } = useAuth();

  useEffect(() => {
    setPageInfo("My Donations", "View your donation history and make new contributions");
  }, [setPageInfo]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/donations");
      if (response.success) {
        const donationsData = response.donations || [];
        setDonations(donationsData);
        
        // Calculate stats
        const totalAmount = donationsData.reduce((sum: number, donation: Donation) => 
          sum + (Number(donation.amount) || 0), 0);
        const thisMonth = donationsData.filter((donation: Donation) => {
          const donationDate = new Date(donation.createdAt);
          const now = new Date();
          return donationDate.getMonth() === now.getMonth() && 
                 donationDate.getFullYear() === now.getFullYear();
        }).reduce((sum: number, donation: Donation) => sum + (Number(donation.amount) || 0), 0);
        const thisYear = donationsData.filter((donation: Donation) => {
          const donationDate = new Date(donation.createdAt);
          const now = new Date();
          return donationDate.getFullYear() === now.getFullYear();
        }).reduce((sum: number, donation: Donation) => sum + (Number(donation.amount) || 0), 0);

        setStats({
          totalDonations: donationsData.length,
          totalAmount,
          thisMonth,
          thisYear
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch donations",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching donations:", error);
      toast({
        title: "Error",
        description: "Failed to fetch donations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleDonationSuccess = () => {
    fetchDonations(); // Refresh the list
    toast({
      title: "Thank You!",
      description: "Your donation has been processed successfully",
    });
  };

  if (loading) {
    return (
      <MemberLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
          <span className="ml-2 text-muted-foreground">Loading your donations...</span>
        </div>
      </MemberLayout>
    );
  }

  return (
    <MemberLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center py-4 sm:py-6 lg:py-8">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 rounded-full bg-muted shadow-sm">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-foreground" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              My Donations
            </h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Track your contributions and see the impact you're making in our community
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            label="Total Donated"
            value={`$${(stats.totalAmount || 0).toFixed(2)}`}
            icon={DollarSign}
          />
          <StatCard
            label="Total Donations"
            value={stats.totalDonations}
            icon={Gift}
          />
          <StatCard
            label="This Month"
            value={`$${(stats.thisMonth || 0).toFixed(2)}`}
            icon={Calendar}
          />
          <StatCard
            label="This Year"
            value={`$${(stats.thisYear || 0).toFixed(2)}`}
            icon={TrendingUp}
          />
        </div>

        {/* Make New Donation */}
        <Card className="shadow-sm bg-muted">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 rounded-full bg-card shadow-sm">
                  <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-foreground" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">Make a New Donation</h3>
              </div>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                Your donation helps us provide better healthcare services and support our community initiatives.
                Every contribution makes a difference.
              </p>
              <DonationDialog>
                <Button className="font-semibold px-6 sm:px-8 py-2 sm:py-3">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Make a Donation
                </Button>
              </DonationDialog>
            </div>
          </CardContent>
        </Card>

        {/* Donation History */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Receipt className="h-5 w-5" />
              <span>Donation History</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {donations.length > 0 ? (
              <div className="space-y-4">
                {donations.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-xl hover:border-foreground/30 transition-all duration-200 space-y-3 sm:space-y-0"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="p-2 rounded-lg bg-muted">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          ${(Number(donation.amount) || 0).toFixed(2)} {donation.currency?.toUpperCase() || 'USD'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {donation.message || donation.description || "Community Donation"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(donation.createdAt), "MMM dd, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <StatusBadge status={donation.status} />
                      {donation.receiptUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(donation.receiptUrl, '_blank')}
                          className="text-xs sm:text-sm"
                        >
                          <Receipt className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Receipt
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <Heart className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">No donations yet</h3>
                <p className="text-muted-foreground mb-6 px-4">
                  Make your first donation to support our community and healthcare initiatives.
                </p>
                <DonationDialog>
                  <Button className="font-semibold">
                    <Heart className="h-4 w-4 mr-2" />
                    Make Your First Donation
                  </Button>
                </DonationDialog>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MemberLayout>
  );
}
