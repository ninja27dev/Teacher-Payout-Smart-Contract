import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: string;
  variant?: "default" | "success" | "warning";
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  trend,
  variant = "default",
  className
}: StatsCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-glow",
      variant === "success" && "border-success/20 bg-gradient-to-br from-success/5 to-transparent",
      variant === "warning" && "border-warning/20 bg-gradient-to-br from-warning/5 to-transparent",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "p-2 rounded-lg",
          variant === "success" && "bg-success/10 text-success",
          variant === "warning" && "bg-warning/10 text-warning",
          variant === "default" && "bg-primary/10 text-primary"
        )}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <p className="text-xs text-success mt-1">
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}