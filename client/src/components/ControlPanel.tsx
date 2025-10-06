import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Square, RotateCcw, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ControlPanelProps {
  status: "idle" | "running" | "completed";
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

export function ControlPanel({ status, onStart, onStop, onReset }: ControlPanelProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Fuzzer Control</h2>
            <p className="text-sm text-muted-foreground">
              Manage fuzzing execution
            </p>
          </div>
        </div>
        <Badge
          variant={status === "running" ? "default" : status === "completed" ? "secondary" : "outline"}
          className="text-sm"
          data-testid="badge-fuzzer-status"
        >
          {status === "idle" ? "Ready" : status === "running" ? "Running" : "Completed"}
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        {status === "idle" && (
          <Button
            onClick={onStart}
            className="flex-1"
            size="lg"
            data-testid="button-start-fuzzing"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Fuzzing
          </Button>
        )}
        {status === "running" && (
          <Button
            onClick={onStop}
            variant="destructive"
            className="flex-1"
            size="lg"
            data-testid="button-stop-fuzzing"
          >
            <Square className="h-4 w-4 mr-2" />
            Stop Fuzzing
          </Button>
        )}
        {status === "completed" && (
          <>
            <Button
              onClick={onStart}
              className="flex-1"
              size="lg"
              data-testid="button-restart-fuzzing"
            >
              <Play className="h-4 w-4 mr-2" />
              Run Again
            </Button>
            <Button
              onClick={onReset}
              variant="outline"
              size="lg"
              data-testid="button-reset-fuzzing"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
