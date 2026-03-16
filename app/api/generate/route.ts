import { NextResponse } from "next/server";
import { generateRequestSchema } from "@/lib/validators";
import { generateCoverLetterAndSuggestions } from "@/lib/openai";

// MVP implementation: no auth required and no persistence.
// This keeps the generator working even if Supabase auth/helpers
// are not fully configured yet.

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = generateRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { resumeText, jobText } = parsed.data;

    const result = await generateCoverLetterAndSuggestions({
      resumeText,
      jobText
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}

