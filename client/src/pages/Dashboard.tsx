import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MetricCard } from "@/components/MetricCard";
import { ConfigPanel } from "@/components/ConfigPanel";
import { MethodCard } from "@/components/MethodCard";
import { CoverageVisualization } from "@/components/CoverageVisualization";
import { LogTerminal } from "@/components/LogTerminal";
import { ResultsTable } from "@/components/ResultsTable";
import { ControlPanel } from "@/components/ControlPanel";
import { ComparisonChart } from "@/components/ComparisonChart";
import { Bug, CheckCircle2, Clock, Zap, Hammer, Brain, Dna, Shield } from "lucide-react";

export default function Dashboard() {
  const [testsPerMethod, setTestsPerMethod] = useState(30);
  const [verboseMode, setVerboseMode] = useState(true);
  const [useRealLlm, setUseRealLlm] = useState(false);
  const [status, setStatus] = useState<"idle" | "running" | "completed">("idle");

  const [logs, setLogs] = useState<Array<{
    id: string;
    timestamp: string;
    level: "info" | "success" | "warning" | "error";
    message: string;
  }>>([
    {
      id: '1',
      timestamp: '12:34:01',
      level: 'info' as const,
      message: 'Fuzzer initialized with 8 seed files',
    },
    {
      id: '2',
      timestamp: '12:34:02',
      level: 'success' as const,
      message: 'Using SIMULATED LLM (no installation needed)',
    },
  ]);

  const bugTypes = [
    {
      id: 'buffer_overflow',
      name: 'Buffer Overflow',
      description: 'Long strings exceeding buffer limits',
      discovered: status === 'completed',
    },
    {
      id: 'injection',
      name: 'Command Injection',
      description: 'Special characters in input fields',
      discovered: status === 'completed',
    },
    {
      id: 'logic_error',
      name: 'Logic Error',
      description: 'Negative age values causing crashes',
      discovered: status === 'completed',
    },
    {
      id: 'array_bounds',
      name: 'Array Bounds',
      description: 'Large arrays exceeding limits',
      discovered: status === 'completed',
    },
    {
      id: 'division_by_zero',
      name: 'Division by Zero',
      description: 'Zero values in rating fields',
      discovered: false,
    },
  ];

  const results = status === 'completed' ? [
    {
      id: '1',
      method: 'Traditional',
      testNumber: 12,
      bugType: 'Buffer Overflow',
      timestamp: '12:34:15',
    },
    {
      id: '2',
      method: 'LLM-Guided',
      testNumber: 8,
      bugType: 'Command Injection',
      timestamp: '12:35:22',
    },
    {
      id: '3',
      method: 'Traditional',
      testNumber: 23,
      bugType: 'Logic Error',
      timestamp: '12:36:44',
    },
    {
      id: '4',
      method: 'Genetic Algorithm',
      testNumber: 15,
      bugType: 'Array Bounds',
      timestamp: '12:37:01',
    },
  ] : [];

  const chartResults = status === 'completed' ? [
    { method: 'Traditional', crashes: 12, coverage: 3, time: 1.2 },
    { method: 'LLM-Guided', crashes: 18, coverage: 4, time: 2.1 },
    { method: 'Genetic', crashes: 15, coverage: 4, time: 1.8 },
  ] : [];

  const handleStart = () => {
    setStatus("running");
    setLogs([...logs, {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 8),
      level: 'info',
      message: `Starting fuzzing campaign with ${testsPerMethod} tests per method...`,
    }]);

    setTimeout(() => {
      setStatus("completed");
      setLogs(prev => [...prev,
        {
          id: Date.now().toString() + '1',
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 8),
          level: 'success',
          message: 'Traditional fuzzing completed: 12 crashes, 3/5 coverage',
        },
        {
          id: Date.now().toString() + '2',
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 8),
          level: 'success',
          message: 'LLM-Guided fuzzing completed: 18 crashes, 4/5 coverage',
        },
        {
          id: Date.now().toString() + '3',
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 8),
          level: 'success',
          message: 'Genetic Algorithm completed: 15 crashes, 4/5 coverage',
        },
      ]);
    }, 3000);
  };

  const handleStop = () => {
    setStatus("completed");
    setLogs([...logs, {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 8),
      level: 'warning',
      message: 'Fuzzing stopped by user',
    }]);
  };

  const handleReset = () => {
    setStatus("idle");
    setLogs([
      {
        id: '1',
        timestamp: '12:34:01',
        level: 'info',
        message: 'Fuzzer initialized with 8 seed files',
      },
      {
        id: '2',
        timestamp: '12:34:02',
        level: 'success',
        message: 'Using SIMULATED LLM (no installation needed)',
      },
    ]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">AI-Powered Fuzzer</h1>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Coverage"
                value={status === 'completed' ? "4/5" : "0/5"}
                icon={CheckCircle2}
                color="success"
                subtitle="Bug types discovered"
              />
              <MetricCard
                title="Crashes Found"
                value={status === 'completed' ? 45 : 0}
                icon={Bug}
                color="danger"
                subtitle="Total vulnerabilities"
              />
              <MetricCard
                title="Tests Run"
                value={status === 'completed' ? testsPerMethod * 3 : 0}
                icon={Zap}
                color="primary"
                subtitle="Across all methods"
              />
              <MetricCard
                title="Avg Time"
                value={status === 'completed' ? "1.7s" : "0s"}
                icon={Clock}
                color="info"
                subtitle="Per method"
              />
            </div>

            <ControlPanel
              status={status}
              onStart={handleStart}
              onStop={handleStop}
              onReset={handleReset}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MethodCard
                title="Traditional"
                description="Random mutations using standard fuzzing techniques"
                icon={Hammer}
                color="warning"
                crashes={status === 'completed' ? 12 : undefined}
                tests={status === 'completed' ? testsPerMethod : undefined}
                coverage={status === 'completed' ? 3 : undefined}
                time={status === 'completed' ? 1.2 : undefined}
                status={status === 'idle' ? 'pending' : status === 'running' ? 'running' : 'completed'}
              />
              <MethodCard
                title="LLM-Guided"
                description="Smart mutations powered by AI language models"
                icon={Brain}
                color="primary"
                crashes={status === 'completed' ? 18 : undefined}
                tests={status === 'completed' ? testsPerMethod : undefined}
                coverage={status === 'completed' ? 4 : undefined}
                time={status === 'completed' ? 2.1 : undefined}
                status={status === 'idle' ? 'pending' : status === 'running' ? 'running' : 'completed'}
              />
              <MethodCard
                title="Genetic Algorithm"
                description="Evolutionary approach with LLM seed generation"
                icon={Dna}
                color="info"
                crashes={status === 'completed' ? 15 : undefined}
                tests={status === 'completed' ? testsPerMethod : undefined}
                coverage={status === 'completed' ? 4 : undefined}
                time={status === 'completed' ? 1.8 : undefined}
                status={status === 'idle' ? 'pending' : status === 'running' ? 'running' : 'completed'}
              />
            </div>

            {status === 'completed' && <ComparisonChart results={chartResults} />}

            <LogTerminal logs={logs} onClear={handleClearLogs} />

            {status === 'completed' && (
              <ResultsTable
                results={results}
                onViewDetails={(id) => console.log('View details:', id)}
              />
            )}
          </div>

          <div className="space-y-6">
            <ConfigPanel
              testsPerMethod={testsPerMethod}
              onTestsPerMethodChange={setTestsPerMethod}
              verboseMode={verboseMode}
              onVerboseModeChange={setVerboseMode}
              useRealLlm={useRealLlm}
              onUseRealLlmChange={setUseRealLlm}
            />

            <CoverageVisualization bugTypes={bugTypes} />
          </div>
        </div>
      </main>
    </div>
  );
}
