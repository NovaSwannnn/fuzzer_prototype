import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: "primary" | "success" | "warning" | "danger" | "info";
  subtitle?: string;
}

const colorClasses = {
  primary: "text-chart-1",
  success: "text-chart-2",
  warning: "text-chart-3",
  danger: "text-chart-5",
  info: "text-chart-4",
};

export function MetricCard({ title, value, icon: Icon, color, subtitle }: MetricCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold tabular-nums mb-1" data-testid={`text-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-md bg-${color === 'primary' ? 'primary' : color === 'success' ? 'chart-2' : color === 'warning' ? 'chart-3' : color === 'danger' ? 'chart-5' : 'chart-4'}/10`}>
          <Icon className={`h-5 w-5 ${colorClasses[color]}`} />
        </div>
      </div>
    </Card>
  );
}
