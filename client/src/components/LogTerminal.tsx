import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Terminal, Copy, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "success" | "warning" | "error";
  message: string;
}

interface LogTerminalProps {
  logs: LogEntry[];
  onClear?: () => void;
}

const levelColors = {
  info: "text-chart-4",
  success: "text-chart-2",
  warning: "text-chart-3",
  error: "text-chart-5",
};

const levelBadges = {
  info: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  success: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  warning: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  error: "bg-chart-5/10 text-chart-5 border-chart-5/20",
};

export function LogTerminal({ logs, onClear }: LogTerminalProps) {
  const { toast } = useToast();

  const copyLogs = () => {
    const text = logs.map((log) => `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}`).join("\n");
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${logs.length} log entries copied`,
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Fuzzer Logs</h2>
          <Badge variant="secondary" className="text-xs font-mono">
            {logs.length} entries
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={copyLogs}
            data-testid="button-copy-logs"
          >
            <Copy className="h-4 w-4" />
          </Button>
          {onClear && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClear}
              data-testid="button-clear-logs"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="h-[400px] w-full rounded-md border bg-[#1a1b1e] dark:bg-[#0d0e10] p-4">
        <div className="space-y-2 font-mono text-xs">
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No logs yet. Start fuzzing to see activity...
            </p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3" data-testid={`log-entry-${log.level}`}>
                <span className="text-muted-foreground tabular-nums flex-shrink-0">
                  {log.timestamp}
                </span>
                <Badge variant="outline" className={`text-xs flex-shrink-0 ${levelBadges[log.level]}`}>
                  {log.level.toUpperCase()}
                </Badge>
                <span className={`${levelColors[log.level]} break-all`}>
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
