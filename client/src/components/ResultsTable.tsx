import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CrashResult {
  id: string;
  method: string;
  testNumber: number;
  bugType: string;
  timestamp: string;
}

interface ResultsTableProps {
  results: CrashResult[];
  onViewDetails?: (id: string) => void;
}

const methodColors = {
  Traditional: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  "LLM-Guided": "bg-chart-1/10 text-chart-1 border-chart-1/20",
  "Genetic Algorithm": "bg-chart-4/10 text-chart-4 border-chart-4/20",
};

export function ResultsTable({ results, onViewDetails }: ResultsTableProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Crash Results</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {results.length} vulnerabilities discovered
          </p>
        </div>
        <Button variant="outline" size="sm" data-testid="button-export-results">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test #</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Bug Type</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No crashes found yet. Start fuzzing to discover vulnerabilities.
                </TableCell>
              </TableRow>
            ) : (
              results.map((result) => (
                <TableRow key={result.id} data-testid={`row-result-${result.id}`}>
                  <TableCell className="font-mono font-medium">
                    #{result.testNumber}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={methodColors[result.method as keyof typeof methodColors]}
                    >
                      {result.method}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{result.bugType}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {result.timestamp}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetails?.(result.id)}
                      data-testid={`button-view-${result.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
