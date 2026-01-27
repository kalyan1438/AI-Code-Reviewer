export interface Issue {
  severity: "high" | "medium" | "low";
  type: string;
  line: number;
  message: string;
}

export interface AnalysisResult {
  score: number;
  issues: Issue[];
  suggestions: string[];
  metrics: {
    security: number;
    performance: number;
    complexity: number;
    maintainability: number;
  };
}
