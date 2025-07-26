import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/store/useAppStore";
import { 
  DollarSign, 
  Search, 
  Calendar, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  ExternalLink
} from "lucide-react";

export default function Payouts() {
  const { payouts } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate real-time analytics
  const totalEarnings = payouts
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);
  
  const pendingAmount = payouts
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);
  
  const successfulPayouts = payouts.filter(p => p.status === 'completed').length;
  const failedPayouts = payouts.filter(p => p.status === 'failed').length;
  const pendingPayouts = payouts.filter(p => p.status === 'pending').length;
  
  const analytics = {
    totalPayouts: totalEarnings.toFixed(1),
    pendingPayouts: pendingAmount.toFixed(1),
    successfulPayouts,
    failedPayouts,
    pendingCount: pendingPayouts,
    averagePerCompletion: successfulPayouts > 0 ? (totalEarnings / successfulPayouts).toFixed(1) : "0.0"
  };

  const filteredPayouts = payouts.filter(payout =>
    payout.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payout.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payout.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Payouts</h1>
        <p className="text-muted-foreground">Track and manage teacher payments for student completions</p>
      </div>

      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">Payment Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by teacher, student, or course name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Payouts List */}
          <div className="space-y-4">
            {filteredPayouts.map((payout) => (
              <Card key={payout.id} className="hover:shadow-card transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(payout.status)}
                        <div>
                          <h3 className="font-semibold">{payout.course}</h3>
                          <p className="text-sm text-muted-foreground">
                            {payout.teacher} → {payout.student}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Teacher Address</p>
                          <p className="font-mono text-xs">{payout.teacherAddress}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Student Address</p>
                          <p className="font-mono text-xs">{payout.studentAddress}</p>
                        </div>
                      </div>

                      {payout.txHash && (
                        <div className="mt-2 flex items-center gap-2">
                          <p className="text-muted-foreground text-sm">Transaction Hash</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-auto p-0 text-primary hover:text-primary-glow"
                            onClick={() => window.open(`https://explorer.stacks.co/txid/${payout.txHash}`, '_blank')}
                          >
                            <span className="font-mono text-xs">{payout.txHash}</span>
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="text-right space-y-2 ml-6">
                      <div className="text-lg font-bold text-success">{payout.amount} STX</div>
                      <Badge variant={getStatusVariant(payout.status)} className="capitalize">
                        {payout.status}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(payout.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPayouts.length === 0 && (
            <Card className="p-12 text-center">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No payouts found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search terms" : "Payouts will appear here once students complete courses"}
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{analytics.totalPayouts} STX</div>
                <p className="text-xs text-muted-foreground">All time earnings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
                <Clock className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{analytics.pendingPayouts} STX</div>
                <p className="text-xs text-muted-foreground">{analytics.pendingCount} transactions pending</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((analytics.successfulPayouts / (analytics.successfulPayouts + analytics.failedPayouts)) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {analytics.successfulPayouts} success, {analytics.failedPayouts} failed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Payment Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average per completion</span>
                    <span className="font-medium">{analytics.averagePerCompletion} STX</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total transactions</span>
                    <span className="font-medium">{payouts.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Successful transactions</span>
                    <span className="font-medium text-success">{analytics.successfulPayouts}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Failed transactions</span>
                    <span className="font-medium text-destructive">{analytics.failedPayouts}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payouts.slice(0, 5).map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payout.status)}
                        <div>
                          <p className="text-sm font-medium">{payout.teacher}</p>
                          <p className="text-xs text-muted-foreground">{payout.course}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-success">{payout.amount} STX</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(payout.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </Layout>
  );
}