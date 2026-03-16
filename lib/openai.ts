import OpenAI from "openai";

export interface GeneratedContent {
  coverLetter: string;
  suggestions: string[];
}

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not configured on the server. Set it in your .env.local file."
    );
  }
  return new OpenAI({ apiKey });
}

export async function generateCoverLetterAndSuggestions(params: {
  resumeText: string;
  jobText: string;
}): Promise<GeneratedContent> {
  const { resumeText, jobText } = params;

  const systemPrompt =
    "You are a senior career coach and hiring manager. " +
    "You help candidates create tailored, professional cover letters and improve their resumes for specific roles. " +
    "Always write in clear, concise, modern professional language without cliches.";

  const userPrompt = `
You are given a candidate resume and a target job description.

RESUME:
---
${resumeText.slice(0, 8000)}
---

JOB DESCRIPTION:
---
${jobText.slice(0, 6000)}
---

Tasks:
1) Generate a tailored cover letter (3–5 paragraphs) that:
  - Sounds like the candidate based on their resume
  - Highlights the most relevant experience and skills for this job
  - References specific responsibilities and requirements from the job posting
  - Maintains a confident, grounded, professional tone

2) Suggest 5–8 concrete resume improvements focused on:
  - Stronger, outcome-driven bullet points
  - Missing or under-emphasized skills relevant to the job
  - Keywords and phrasing that better match the posting
  - Overall structure and clarity

Respond in JSON with the shape:
{
  "coverLetter": "string",
  "suggestions": ["string", "..."]
}
`;

  const client = getClient();

  const completion = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as GeneratedContent;

  return {
    coverLetter: parsed.coverLetter ?? "",
    suggestions: parsed.suggestions ?? []
  };
}

