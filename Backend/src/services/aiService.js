import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const GROQ_MODEL = "llama-3.1-8b-instant";

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
 * Sends code to Groq and returns structured review
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
    const response = await client.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const text = response.choices[0]?.message?.content?.trim() || "";

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
        rating: 0,
      };
    }
    return parsed;

  } catch (err) {
    console.error("Groq request failed:", err.message);
    return {
      analysis: "Groq review failed.",
      runtime_issues: [],
      bugs: [],
      security_issues: [],
      performance_suggestions: [],
      readability_suggestions: [],
      fixed_code: "",
      rating: 0,
    };
  }
}