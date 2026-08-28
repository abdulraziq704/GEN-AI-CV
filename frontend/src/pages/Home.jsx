import {
  ArrowUpRight,
  Brain,
  Code,
  FileCode,
  FileText,
  Projector,
  UploadCloud,
} from "lucide-react";
import { Link } from "react-router";

const CATEGORY_PREVIEW = [
  { id: "technical", label: "Technical", icon: Code, count: 20 },
  { id: "behavioral", label: "Behavioral", icon: Brain, count: 10 },
  { id: "projectBased", label: "Project-Based", icon: Projector, count: 10 },
  { id: "fieldBasics", label: "Field Basics", icon: FileCode, count: 10 },
];

const STEPS = [
  {
    n: "1",
    title: "Upload your CV",
    body: "Drop in your resume as a PDF — no forms, no manual entry.",
  },
  {
    n: "2",
    title: "Gemini reads it",
    body: "Your stack, your projects, your experience — parsed straight from the document.",
  },
  {
    n: "3",
    title: "Get 50 questions",
    body: "Technical, behavioral, project, and fundamentals — sorted and ready to prep.",
  },
];

function scrollToUpload() {
  document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" });
}

export default function Home() {
  return (
    <>
      {/* hero — centered */}
      <section className="relative overflow-hidden border-b border-border bg-background">
        {/* ambient backdrop — one restrained signal, centered behind the content */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[600px] -translate-x-1/2 rounded-full bg-tertiary/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl px-6 pb-20 pt-6 text-center sm:pb-28 sm:pt-12">
          {/* copy */}
          <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              cv <span className="text-tertiary">→</span> interview prep
            </p>

            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              <span className="text-tertiary">50</span> interview questions,
              <br />
              built from your{" "}
              <span className="underline decoration-border decoration-4 underline-offset-4">
                one
              </span>{" "}
              CV.
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Upload your resume and get a question set pulled from what's
              actually on it — your stack, your projects, your experience.
              No generic prep lists.
            </p>

            {/* single centered CTA */}
            <div className="mt-9 flex flex-col items-center gap-4">
              <Link
                 to={"/tool"}
                className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                <UploadCloud size={16} />
                Upload Your CV
              </Link>

              <Link
                to="/sample"
                target="_blank"
                
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                See a sample set
                <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="mt-10 flex items-center justify-center gap-6 border-t border-border pt-6 font-mono text-xs text-muted-foreground">
              <span>50 questions</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>4 categories</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>Gemini-generated</span>
            </div>
          </div>

          {/* signature visual — centered below, CV feeding into its categories */}
          <div className="relative mx-auto mt-16 w-full max-w-md motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
            <div className="mx-auto w-48 -rotate-2 rounded-2xl border border-border bg-surface p-4 text-left shadow-card">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-primary">
                  <FileText size={14} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-foreground">
                    resume.pdf
                  </p>
                  <p className="text-[11px] text-muted-foreground">Parsed</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 w-full rounded-full bg-muted" />
                <div className="h-1.5 w-4/5 rounded-full bg-muted" />
                <div className="h-1.5 w-3/5 rounded-full bg-muted" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {CATEGORY_PREVIEW.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.id}
                    style={{ animationDelay: `${300 + i * 100}ms` }}
                    className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 rounded-xl border border-border bg-surface p-3 text-left shadow-card"
                  >
                    <Icon size={14} className="mb-2 text-tertiary" />
                    <p className="text-lg font-bold leading-none text-foreground">
                      {cat.count}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {cat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* how it works — real 3-step sequence, so numbering earns its place */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl sm:px-24 px-5 py-16">
          <div className="grid grid-cols-1 gap-18 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="text-center md:text-left">
                <span className="font-mono text-sm text-tertiary">
                  {step.n.padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}