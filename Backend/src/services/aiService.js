import fetch from "node-fetch";

const OLLAMA_URL ="http://localhost:11434/api/generate";
const OLLAMA_MODEL ="qwen2.5-coder:3b";

/**
 * Safely parses JSON returned by the model
 */
function safeJSONParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch {}
    }
    return null;
  }
}

/**
 * Sends code to Ollama and returns structured review
 */
export async function reviewCode(code, language) {
  const prompt = `
You are an expert code reviewer. Review the code and identify:
1. Syntax errors
2. Runtime issues
3. Logical/bug issues
4. Security vulnerabilities
5. Performance suggestions
6. Readability improvements

Return ONLY a valid JSON object with these fields:

{
  "analysis": "brief summary of the code quality",
  "runtime_issues": [],
  "bugs": [],
  "security_issues": [],
  "performance_suggestions": [],
  "readability_suggestions": [],
  "fixed_code": "",
  "rating": 1
}

Review the following ${language} code exactly as given:

\`\`\`${language}
${code}
\`\`\`
`;

  try {
    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        temperature: 0.7 // deterministic
      }),
      timeout: 40000 // 60s for CPU
    });

    if (!response.ok) throw new Error(`Ollama API error: ${response.status}`);
    const data = await response.json();
    const text = data.response?.trim() || "";

    const parsed = safeJSONParse(text);
    if (!parsed) {
      console.warn("Failed to parse JSON, returning raw response");
      return {
        analysis: text || "No response",
        runtime_issues: [],
        bugs: [],
        security_issues: [],
        performance_suggestions: [],
        readability_suggestions: [],
        fixed_code: "",
        rating: 0
      };
    }
    return parsed;

  } catch (err) {
    console.error("Ollama request failed:", err.message);
    return {
      analysis: "Ollama review failed.",
      runtime_issues: [],
      bugs: [],
      security_issues: [],
      performance_suggestions: [],
      readability_suggestions: [],
      fixed_code: "",
      rating: 0
    };
  }
}
