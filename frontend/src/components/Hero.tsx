import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Shield, Zap, Globe } from "lucide-react";
import heroImage from "@/assets/hero-education.jpg";

export function Hero() {
  const features = [
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Secure Payments",
      description: "Blockchain-secured automatic payouts"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Instant Processing",
      description: "Real-time completion tracking"
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "Global Access",
      description: "Cross-border educational services"
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Educational Technology" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <GraduationCap className="h-4 w-4 mr-2" />
            Revolutionary Education Technology
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Performance-Based
            </span>
            <br />
            Teacher Payments
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Automate teacher compensation with blockchain technology. Get paid instantly when students complete courses, creating a transparent and motivating education ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="hero" size="lg" className="text-lg px-8 py-3">
              Register as Teacher
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Learn More
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-card transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}