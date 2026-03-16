import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, FileText, Wand2 } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950">
      <div className="container flex min-h-screen flex-col">
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              ApplyCraft
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Log in
            </Link>
            <Button asChild size="sm">
              <Link href="/signup">
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-10">
          <div className="max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs text-slate-300">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>AI-powered cover letters & resume optimization</span>
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl md:text-6xl">
              Turn any job posting into a tailored{" "}
              <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
                cover letter & resume
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-balance text-sm text-slate-300 sm:text-base">
              Paste your resume and a job description. ApplyCraft analyzes both,
              generates a personalized cover letter, and suggests laser-focused
              resume improvements that match exactly what hiring managers are
              looking for.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Button asChild size="lg" className="px-8">
                <Link href="/app">
                  Launch generator
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <button className="text-sm font-medium text-slate-300 hover:text-slate-100">
                No credit card required
              </button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                  <FileText className="h-4 w-4" />
                </div>
                <h3 className="mb-1 text-sm font-semibold text-slate-50">
                  Resume-aware letters
                </h3>
                <p className="text-xs text-slate-300">
                  Upload or paste your resume and get letters that sound like
                  you—not a generic template.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Wand2 className="h-4 w-4" />
                </div>
                <h3 className="mb-1 text-sm font-semibold text-slate-50">
                  Role-specific tailoring
                </h3>
                <p className="text-xs text-slate-300">
                  We analyze the job description to highlight the exact skills
                  and experience that matter most.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="mb-1 text-sm font-semibold text-slate-50">
                  Resume optimization
                </h3>
                <p className="text-xs text-slate-300">
                  Get concrete suggestions for stronger bullets, missing
                  keywords, and better alignment with the role.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} ApplyCraft. Built for job seekers who
          care about craft.
        </footer>
      </div>
    </main>
  );
}

