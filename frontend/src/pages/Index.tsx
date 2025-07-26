import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Hero />
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Platform Overview</h2>
          <Dashboard />
        </div>
      </div>
    </div>
  );
};

export default Index;
