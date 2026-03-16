import { ReactNode } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              ApplyCraft
            </span>
          </Link>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>AI Resume & Cover Letters</span>
          </div>
        </div>
      </div>
      <main className={cn("container py-6")}>{children}</main>
    </div>
  );
}

