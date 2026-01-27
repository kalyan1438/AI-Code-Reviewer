// SubmitCodePage.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/components/ThemeProvider";
import apiService from "@/services/api";
import {
  ArrowLeft,
  Upload,
  CheckCircle,
  AlertCircle,
  Code,
  BarChart3,
  Lightbulb,
  Loader2,
  Shield,
  Zap
} from "lucide-react";

import Editor from "@monaco-editor/react";
import { AnalysisResult } from "@/types";

interface SubmitCodePageProps {
  onNavigate: (page: string) => void;
}

export function SubmitCodePage({ onNavigate }: SubmitCodePageProps) {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const { theme } = useTheme();

  const defaultCode: Record<string, string> = {
javascript:`console.log("WELCOME to AI Code Reviewer editor");`,
typescript: `   console.log("WELCOME to AI Code Reviewer editor");`,
python: `print("WELCOME to AI Code Reviewer editor")`,
java: `class Main{  
  public static void main(String[] args) {
    System.out.println("WELCOME to AI Code Reviewer editor");
    }
  }`,
cpp: `#include <iostream>
#include <vector>
using namespace std;
int main() {
  cout << "WELCOME to AI Code Reviewer editor" << " ";
  return 0;
}`,
c: `#include <stdio.h>
int main() {
  printf("WELCOME to AI Code Reviewer editor");
  // Write your code 
  return 0;
}`
  };

  // Initialize code for selected language
  useEffect(() => {
    setCode(defaultCode[language]);
  }, [language]);

  useEffect(() => {
    setCode(defaultCode.javascript);
  }, []);

  // Polling for analysis
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (submissionId && isAnalyzing) {
      interval = setInterval(async () => {
        try {
          const response = await apiService.getAnalysis(submissionId);
          if (response.success && response.data) {
            const { status, analysis } = response.data;
            if (status === "completed" && analysis) {
              setAnalysisResult(analysis as unknown as AnalysisResult);
              setIsAnalyzing(false);
              setSubmissionId(null);
            } else if (status === "failed") {
              setIsAnalyzing(false);
              setSubmissionId(null);
            }
          }
        } catch (err) {
          console.error("Polling error:", err);
          setIsAnalyzing(false);
          setSubmissionId(null);
        }
      }, 2000);
    }
    return () => interval && clearInterval(interval);
  }, [submissionId, isAnalyzing]);

  const handleAnalyzeCode = async () => {
    if (!code.trim()) return;
    if (!apiService.isAuthenticated()) return onNavigate("login");

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await apiService.submitCode({ code, language, title: `${language} Code Analysis` });
      if (response.success && response.data) setSubmissionId(response.data.submissionId);
    } catch (err) {
      console.error("Submit error:", err);
      setIsAnalyzing(false);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => setCode(evt.target?.result as string);
    reader.readAsText(file);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high": return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "medium": return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "low": return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" onClick={() => onNavigate("")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">AI Code Review</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[calc(100vh-180px)]">
        {/* Monaco Editor Card */}
        <Card className="flex flex-col">
          <CardHeader className="flex justify-between items-center pb-4">
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" /> Code Editor
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="c">C</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="gap-2">
                <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2">
                  <Upload className="h-4 w-4" /> Upload
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".js,.ts,.py,.java,.cpp,.c"
                  onChange={handleUpload}
                  className="hidden"
                />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-4 relative">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(val) => setCode(val || "")}
              theme={theme === "dark" ? "vs-dark" : "light"}
              options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: "on" }}
            />
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/90 px-2 py-1 rounded border backdrop-blur-sm">
              Lines: {code.split("\n").length} | Characters: {code.length}
            </div>
          </CardContent>
          <div
            className={`rounded-lg border ${
              theme === "dark" ? "border-gray-700 bg-gray-900" : "border-gray-300 bg-white"
            }`}
          >
            <Button
              onClick={handleAnalyzeCode}
              disabled={isAnalyzing || !code.trim()}
              className="w-full gap-2"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />Analyzing Code...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" /> Analyze with AI
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Analysis Results Card */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" /> AI Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {!analysisResult && !isAnalyzing && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Code className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Ready for AI Analysis</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Submit your code to get intelligent insights on performance, security, style, and best practices.
                  </p>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="relative">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">AI is analyzing your code...</h3>
                  <p className="text-muted-foreground">This usually takes a few seconds</p>
                </div>
              </div>
            )}

            {analysisResult && (
              <Tabs defaultValue="overview" className="h-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="issues">Issues</TabsTrigger>
                  <TabsTrigger value="suggestions">Tips</TabsTrigger>
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  <div className="text-center space-y-4">
                    <div>
                      <div className="text-4xl font-bold text-primary mb-2">
                        {analysisResult.score ?? 0}/10
                      </div>
                      <p className="text-muted-foreground">Overall Code Quality Score</p>
                    </div>
                    <Progress value={(analysisResult.score ?? 0) * 10} className="w-full h-3" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Card className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="font-semibold text-sm">Critical</span>
                      </div>
                      <div className="text-2xl font-bold text-red-500">
                        {analysisResult.issues?.filter(i => i.severity === 'high').length ?? 0}
                      </div>
                    </Card>
                    <Card className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold text-sm">Warnings</span>
                      </div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {analysisResult.issues?.filter(i => i.severity === 'medium').length ?? 0}
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="issues" className="space-y-3 mt-6">
                  {analysisResult.issues?.map((issue, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start gap-3">
                        {getSeverityIcon(issue.severity)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={getSeverityColor(issue.severity) as "default" | "destructive" | "secondary"} className="text-xs">
                              {issue.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">Line {issue.line}</span>
                          </div>
                          <p className="text-sm leading-relaxed">{issue.message}</p>
                        </div>
                      </div>
                    </Card>
                  )) ?? <p className="text-muted-foreground">No issues detected</p>}
                </TabsContent>

                <TabsContent value="suggestions" className="space-y-3 mt-6">
                  {analysisResult.suggestions?.map((suggestion, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm leading-relaxed">{suggestion}</p>
                      </div>
                    </Card>
                  )) ?? <p className="text-muted-foreground">No suggestions available</p>}
                </TabsContent>

                <TabsContent value="metrics" className="space-y-4 mt-6">
                  {Object.entries(analysisResult.metrics ?? {}).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium capitalize flex items-center gap-2">
                          {key === 'security' && <Shield className="h-4 w-4" />}
                          {key === 'performance' && <Zap className="h-4 w-4" />}
                          {key === 'complexity' && <BarChart3 className="h-4 w-4" />}
                          {key === 'maintainability' && <Code className="h-4 w-4" />}
                          {key}
                        </span>
                        <span className="text-sm font-bold">{value}/10</span>
                      </div>
                      <Progress value={value * 10} className="h-2" />
                    </div>
                  )) ?? <p className="text-muted-foreground">No metrics available</p>}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
