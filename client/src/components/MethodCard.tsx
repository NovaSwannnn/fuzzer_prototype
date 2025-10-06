import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface MethodCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: "primary" | "success" | "warning" | "info";
  crashes?: number;
  tests?: number;
  coverage?: number;
  time?: number;
  status: "pending" | "running" | "completed";
}

const colorClasses = {
  primary: "border-chart-1/20 bg-chart-1/5",
  success: "border-chart-2/20 bg-chart-2/5",
  warning: "border-chart-3/20 bg-chart-3/5",
  info: "border-chart-4/20 bg-chart-4/5",
};

const iconColorClasses = {
  primary: "text-chart-1",
  success: "text-chart-2",
  warning: "text-chart-3",
  info: "text-chart-4",
};

export function MethodCard({
  title,
  description,
  icon: Icon,
  color,
  crashes = 0,
  tests = 0,
  coverage = 0,
  time = 0,
  status,
}: MethodCardProps) {
  const progress = tests > 0 ? 100 : 0;

  return (
    <Card className={`p-6 border-2 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon className={`h-5 w-5 ${iconColorClasses[color]}`} />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Badge
          variant={status === "completed" ? "default" : status === "running" ? "secondary" : "outline"}
          data-testid={`badge-status-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {status === "pending" ? "Pending" : status === "running" ? "Running" : "Completed"}
        </Badge>
      </div>

      {status === "running" && (
        <div className="mb-4">
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {status === "completed" && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Crashes</p>
            <p className="text-xl font-bold tabular-nums" data-testid={`text-crashes-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {crashes}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Coverage</p>
            <p className="text-xl font-bold tabular-nums">{coverage}/5</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Tests</p>
            <p className="text-xl font-bold tabular-nums">{tests}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Time</p>
            <p className="text-xl font-bold tabular-nums">{time}s</p>
          </div>
        </div>
      )}
    </Card>
  );
}
