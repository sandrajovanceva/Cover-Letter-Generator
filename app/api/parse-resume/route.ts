import { NextResponse } from "next/server";
import pdf from "pdf-parse";
import { Document, Packer } from "docx";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text = "";

    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      const data = await pdf(buffer);
      text = data.text;
    } else if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.endsWith(".docx")
    ) {
      // Very lightweight DOCX handling: rely on docx library to read text if needed.
      // For simplicity, we treat it as plain text is not trivial; in a real app you'd use a parser.
      // Here we just return an error hinting at preferring PDF or pasted text.
      text =
        "DOCX parsing is not fully implemented in this MVP. Please paste your resume text or upload a PDF.";
    } else {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to parse resume file" },
      { status: 500 }
    );
  }
}

