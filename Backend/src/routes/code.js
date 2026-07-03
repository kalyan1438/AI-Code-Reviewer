import express from "express";
import { reviewCode } from "../services/aiService.js";
import { protect } from "../middleware/auth.js";
import CodeSubmission from "../models/CodeSubmission.js";
const router = express.Router();

// In-memory storage for submissions
const submissions = {};

// Submit code endpoint
router.post("/submit", protect, async (req, res) => {
  const { code, language, title } = req.body;
  if (!code || !language) return res.status(400).json({ success: false, error: "Code and language are required" });

  const submissionId = Date.now().toString();
  submissions[submissionId] = { status: "pending", analysis: null };

  // Analyze code asynchronously
  (async () => {
    try {
      const analysis = await reviewCode(code, language);

      // Transform Ollama response to match frontend expected structure
      const transformed = {
        score: analysis.rating ?? 0,
        issues: [
          ...(analysis.runtime_issues ?? []).map((msg) => ({ type: "Runtime", severity: "high", message: msg, line: 0 })),
          ...(analysis.bugs ?? []).map((msg) => ({ type: "Bug", severity: "high", message: msg, line: 0 })),
          ...(analysis.security_issues ?? []).map((msg) => ({ type: "Security", severity: "medium", message: msg, line: 0 })),
        ],
        suggestions: [
          ...(analysis.performance_suggestions ?? []),
          ...(analysis.readability_suggestions ?? []),
        ],
        metrics: {
          performance: analysis.rating ?? 0,
          security: analysis.rating ?? 0,
          maintainability: analysis.rating ?? 0,
          complexity: analysis.rating ?? 0,
        },
        fixed_code: analysis.fixed_code ?? "",
      };

      submissions[submissionId] = { status: "completed", analysis: transformed };
      await CodeSubmission.create({
        user: req.user._id,
        code,
        language,
        title: title || "Untitled",
        status: "completed",
        analysis: {
          score: transformed.score,
          issues: transformed.issues,
          suggestions: transformed.suggestions,
          metrics: transformed.metrics,
          fixed_code: transformed.fixed_code,
        }
      });
    } catch (err) {
      console.error("AI review failed:", err.message);
      submissions[submissionId] = { status: "failed", analysis: null };
      await CodeSubmission.create({
        user: req.user._id,
        code,
        language,
        title: title || "Untitled",
        status: "failed",
        analysis: null
      }).catch(e => console.error("DB save failed:", e.message));
    }
  })();

  res.json({ success: true, data: { submissionId } });
});

// Polling endpoint
router.get("/analysis/:submissionId", (req, res) => {
  const { submissionId } = req.params;
  const submission = submissions[submissionId];
  if (!submission) return res.status(404).json({ success: false, error: "Submission not found" });

  res.json({ success: true, data: submission });
});

export default router;
