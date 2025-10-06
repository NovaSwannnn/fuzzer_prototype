import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ConfigPanelProps {
  testsPerMethod: number;
  onTestsPerMethodChange: (value: number) => void;
  verboseMode: boolean;
  onVerboseModeChange: (value: boolean) => void;
  useRealLlm: boolean;
  onUseRealLlmChange: (value: boolean) => void;
}

export function ConfigPanel({
  testsPerMethod,
  onTestsPerMethodChange,
  verboseMode,
  onVerboseModeChange,
  useRealLlm,
  onUseRealLlmChange,
}: ConfigPanelProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings2 className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Configuration</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="tests-per-method" className="text-sm font-medium">
            Tests Per Method
          </Label>
          <Input
            id="tests-per-method"
            type="number"
            value={testsPerMethod}
            onChange={(e) => onTestsPerMethodChange(parseInt(e.target.value) || 30)}
            min={10}
            max={500}
            data-testid="input-tests-per-method"
          />
          <p className="text-xs text-muted-foreground">
            30 = Quick demo (~2 min), 100 = Full demo (~8 min)
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="llm-mode" className="text-sm font-medium">
                LLM Mode
              </Label>
              <p className="text-xs text-muted-foreground">
                Use real LLM or simulated patterns
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={useRealLlm ? "default" : "secondary"} className="text-xs">
                {useRealLlm ? "Real" : "Simulated"}
              </Badge>
              <Switch
                id="llm-mode"
                checked={useRealLlm}
                onCheckedChange={onUseRealLlmChange}
                data-testid="switch-llm-mode"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="verbose-mode" className="text-sm font-medium">
                Verbose Output
              </Label>
              <p className="text-xs text-muted-foreground">
                Show detailed progress logs
              </p>
            </div>
            <Switch
              id="verbose-mode"
              checked={verboseMode}
              onCheckedChange={onVerboseModeChange}
              data-testid="switch-verbose-mode"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
