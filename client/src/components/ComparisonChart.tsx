import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface MethodResult {
  method: string;
  crashes: number;
  coverage: number;
  time: number;
}

interface ComparisonChartProps {
  results: MethodResult[];
}

export function ComparisonChart({ results }: ComparisonChartProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Performance Comparison</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={results}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="method"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: "hsl(var(--foreground))" }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: "hsl(var(--foreground))" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.375rem",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Legend />
          <Bar dataKey="crashes" fill="hsl(var(--chart-5))" name="Crashes Found" radius={[4, 4, 0, 0]} />
          <Bar dataKey="coverage" fill="hsl(var(--chart-2))" name="Bug Coverage" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
