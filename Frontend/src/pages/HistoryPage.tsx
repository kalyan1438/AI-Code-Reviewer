import { useState, useEffect } from "react";
import { Calendar, Search, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface CodeSubmission {
  id: string;
  timestamp: string; // string from DB
  language: string;
  codePreview: string;
}

interface HistoryPageProps {
  onNavigate: (page: string) => void;
}

export function HistoryPage({ onNavigate }: HistoryPageProps) {
  const [submissions, setSubmissions] = useState<CodeSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const response = await fetch("/api/submissions");
        const data = await response.json();
        setSubmissions(data);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSubmissions();
  }, []);

  const filteredSubmissions = submissions.filter(
    (submission) =>
      submission.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.codePreview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    const days = hours / 24;
    if (hours < 1) return `${Math.floor(diff / (1000 * 60))} minutes ago`;
    if (hours < 24) return `${Math.floor(hours)} hours ago`;
    if (days < 7) return `${Math.floor(days)} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) return <div className="p-6 text-[#000000] dark:text-[#ffffff]">Loading submissions...</div>;

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#000000] dark:bg-[#000000] dark:text-[#ffffff] p-6 transition-colors relative">
      
      {/* Home button fixed at top-left corner */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 left-4 gap-2 text-[#000000] dark:text-[#ffffff]"
        onClick={() => onNavigate("")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Button>

      {/* Card */}
      <Card className="rounded-lg border border-[#000000] dark:border-[#ffffff] bg-[#ffffff] dark:bg-[#000000] shadow-md mt-12">
        <CardHeader>
          <CardTitle className="text-xl">Code Submission History</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search Input */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#000000] dark:text-[#ffffff] h-4 w-4" />
            <Input
              placeholder="Search by language or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#ffffff] dark:bg-[#000000] text-[#000000] dark:text-[#ffffff] border border-[#000000] dark:border-[#ffffff]"
            />
          </div>

          {/* Table */}
          <div className="rounded-lg border border-[#000000] dark:border-[#ffffff] overflow-hidden">
            <Table>
              <TableHeader className="bg-[#ffffff] dark:bg-[#000000] border-b border-[#000000] dark:border-[#ffffff]">
                <TableRow>
                  <TableHead className="text-[#000000] dark:text-[#ffffff]">ID</TableHead>
                  <TableHead className="text-[#000000] dark:text-[#ffffff]">Language</TableHead>
                  <TableHead className="text-[#000000] dark:text-[#ffffff]">Time</TableHead>
                  <TableHead className="text-[#000000] dark:text-[#ffffff]">Code Preview</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-12 text-[#000000] dark:text-[#ffffff]"
                    >
                      No submissions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubmissions.map((submission) => (
                    <TableRow
                      key={submission.id}
                      className="hover:bg-[#f5f5f5] dark:hover:bg-[#111111] transition-colors"
                    >
                      <TableCell>{submission.id}</TableCell>
                      <TableCell>{submission.language}</TableCell>
                      <TableCell className="flex items-center gap-1 text-sm text-[#000000] dark:text-[#ffffff]">
                        <Calendar className="h-3 w-3" />
                        {formatTimeAgo(submission.timestamp)}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-[#f5f5f5] dark:bg-[#111111] px-2 py-1 rounded block overflow-hidden text-ellipsis whitespace-nowrap">
                          {submission.codePreview}
                        </code>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
