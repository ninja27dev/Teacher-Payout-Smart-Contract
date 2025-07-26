import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, DollarSign, Users, BarChart3, Wallet, Loader2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/hooks/use-toast";

export function Navigation() {
  const { isWalletConnected, walletAddress, isLoading, connectWallet, disconnectWallet } = useAppStore();
  const { toast } = useToast();
  const navItems = [
    { to: "/", label: "Dashboard", icon: BarChart3 },
    { to: "/teachers", label: "Teachers", icon: GraduationCap },
    { to: "/students", label: "Students", icon: Users },
    { to: "/payouts", label: "Payouts", icon: DollarSign },
  ];

  const handleWalletAction = async () => {
    if (isWalletConnected) {
      disconnectWallet();
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected successfully.",
      });
    } else {
      try {
        await connectWallet();
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to your Stacks wallet!",
        });
      } catch (error) {
        toast({
          title: "Connection Failed",
          description: "Failed to connect wallet. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">TeacherTokens</h1>
              <p className="text-xs text-muted-foreground">Blockchain Education Payments</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`
                }
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </NavLink>
            ))}
          </div>

          {isWalletConnected && walletAddress && (
            <div className="hidden lg:flex items-center bg-card/50 border border-border rounded-lg px-3 py-1">
              <Wallet className="h-4 w-4 text-success mr-2" />
              <span className="text-xs font-mono">
                {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
              </span>
              <Badge variant="default" className="ml-2 text-xs">Connected</Badge>
            </div>
          )}

          <Button 
            variant={isWalletConnected ? "outline" : "hero"} 
            size="sm" 
            onClick={handleWalletAction}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wallet className="h-4 w-4" />
            )}
            {isLoading ? "Connecting..." : isWalletConnected ? "Disconnect" : "Connect Wallet"}
          </Button>
        </div>
      </div>
    </nav>
  );
}