import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";

interface BugType {
  id: string;
  name: string;
  description: string;
  discovered: boolean;
}

interface CoverageVisualizationProps {
  bugTypes: BugType[];
}

export function CoverageVisualization({ bugTypes }: CoverageVisualizationProps) {
  const discoveredCount = bugTypes.filter((b) => b.discovered).length;
  const totalCount = bugTypes.length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Bug Coverage</h2>
        <Badge variant="secondary" className="text-sm font-mono">
          {discoveredCount}/{totalCount}
        </Badge>
      </div>

      <div className="space-y-3">
        {bugTypes.map((bug) => (
          <div
            key={bug.id}
            className={`flex items-start gap-3 p-3 rounded-md border ${
              bug.discovered
                ? "border-chart-2/20 bg-chart-2/5"
                : "border-border bg-muted/30"
            }`}
            data-testid={`bug-type-${bug.id}`}
          >
            {bug.discovered ? (
              <CheckCircle2 className="h-5 w-5 text-chart-2 flex-shrink-0 mt-0.5" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium">{bug.name}</p>
                {bug.discovered && (
                  <Badge variant="outline" className="text-xs bg-chart-2/10 border-chart-2/20">
                    Discovered
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{bug.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
