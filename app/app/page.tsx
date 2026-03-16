"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { generateRequestSchema } from "@/lib/validators";
import { Loader2, UploadCloud, Wand2, Clipboard, Download } from "lucide-react";

const formSchema = generateRequestSchema;

type FormValues = z.infer<typeof formSchema>;

export default function GeneratorPage() {
  const [coverLetter, setCoverLetter] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsingResume, setParsingResume] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeText: "",
      jobText: ""
    }
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setError(null);
      setParsingResume(true);
      const res = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to parse file");
      }
      form.setValue("resumeText", data.text || "");
    } catch (err: any) {
      setError(err.message || "Failed to parse resume file");
    } finally {
      setParsingResume(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate");
      }
      setCoverLetter(data.coverLetter || "");
      setSuggestions(data.suggestions || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!coverLetter) return;
    await navigator.clipboard.writeText(coverLetter);
  };

  const handleDownload = () => {
    if (!coverLetter) return;
    const blob = new Blob([coverLetter], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cover-letter.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <section className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">
            Generator workspace
          </h1>
          <p className="text-xs text-slate-400">
            Upload your resume (PDF / DOCX) and paste a job description.
            We&apos;ll generate a tailored cover letter and resume improvements.
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4"
        >
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-200">
              Resume
            </label>
            <label
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-700 bg-slate-950/60 px-4 py-8 text-center hover:border-slate-500"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  const target = {
                    files: [file]
                  } as unknown as React.ChangeEvent<HTMLInputElement>["target"];
                  handleFileChange({ target } as React.ChangeEvent<HTMLInputElement>);
                }
              }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-slate-300">
                <UploadCloud className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-slate-100">
                  Drag and drop your resume here
                </p>
                <p className="text-[11px] text-slate-400">
                  Supported: PDF, DOCX (max ~10MB)
                </p>
              </div>
              <span className="mt-2 inline-flex rounded-md bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-900">
                Browse files
              </span>
              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {parsingResume && (
              <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-slate-400">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Extracting text from your resume…</span>
              </div>
            )}

            {!parsingResume && form.watch("resumeText") && (
              <div className="space-y-1 pt-2">
                <p className="text-[11px] font-medium text-slate-300">
                  Extracted resume text
                </p>
                <TextareaAutosize
                  minRows={6}
                  {...form.register("resumeText")}
                  className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-mono leading-relaxed text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-slate-600 whitespace-pre-wrap"
                  placeholder="Paste your resume here or upload a file above..."
                />
              </div>
            )}

            {form.formState.errors.resumeText && (
              <p className="text-[11px] text-red-400">
                {form.formState.errors.resumeText.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-200">
              Job description
            </label>
            <TextareaAutosize
              minRows={6}
              {...form.register("jobText")}
              className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-slate-600"
              placeholder="Paste the job posting here..."
            />
            {form.formState.errors.jobText && (
              <p className="text-[11px] text-red-400">
                {form.formState.errors.jobText.message}
              </p>
            )}
          </div>

          {error && (
            <p className="text-[11px] text-red-400">
              {error}
            </p>
          )}

          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-3.5 w-3.5" />
                  Generate cover letter
                </>
              )}
            </Button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold tracking-tight">
            Results & editing
          </h2>
          <p className="text-xs text-slate-400">
            Refine the AI output, copy, or download for your application.
          </p>
        </div>

        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-medium text-slate-200">
              Cover letter
            </h3>
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                disabled={!coverLetter}
                title="Copy"
              >
                <Clipboard className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                disabled={!coverLetter}
                title="Download"
              >
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <TextareaAutosize
            minRows={12}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-slate-600"
            placeholder="Your generated cover letter will appear here."
          />
        </div>

        <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h3 className="text-xs font-medium text-slate-200">
            Resume optimization suggestions
          </h3>
          {suggestions.length === 0 ? (
            <p className="text-xs text-slate-400">
              Once generated, you&apos;ll see concrete ideas here for stronger
              bullets, missing skills, and better alignment with the role.
            </p>
          ) : (
            <ul className="space-y-1.5 text-xs text-slate-200">
              {suggestions.map((item, idx) => (
                <li
                  key={idx}
                  className="flex gap-2 rounded-md bg-slate-950/60 px-2 py-1.5"
                >
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-sky-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

