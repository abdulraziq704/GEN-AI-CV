import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router"; // check: react-router-dom if you're on RRv6, react-router is fine on v7
import QuestionCard from "../components/QuestionCard";
import { Brain, Code, FileCode, Projector } from "lucide-react";
import { useQuestionSet } from "../hook/userquestions.handle.js";
import DownloadPdf from "../components/DownloadPdf.jsx";

const CATEGORY_CONFIG = [
  { id: "technical", label: "Technical Expertise", icon: <Code /> },
  { id: "behavioral", label: "Behavioral & Soft Skills", icon: <Brain /> },
  { id: "projectBased", label: "Project Based", icon: <Projector /> },
  // was "Role-Specific Scenarios" — this category's real content (OOP, ACID,
  // DNS, XSS...) is fundamentals, not scenarios. Your call if you'd rather
  // keep the old label.
  { id: "fieldBasics", label: "Field Basics", icon: <FileCode /> },
];

const CvQuestion = () => {
  const { cvId } = useParams();
  const { data, loading, error, updateNote, savingIds } = useQuestionSet(cvId);

  const [activeCategory, setActiveCategory] = useState("technical");
  const [expandedIndex, setExpandedIndex] = useState(null);

  const currentQuestions = data?.[activeCategory] ?? [];
  const activeConfig = CATEGORY_CONFIG.find((c) => c.id === activeCategory);

  const { totalQuestions, progressPct, filledSegments } = useMemo(() => {
    if (!data) return { totalQuestions: 0, progressPct: 0, filledSegments: 0 };
    const total = CATEGORY_CONFIG.reduce(
      (sum, cat) => sum + (data[cat.id]?.length ?? 0),
      0
    );
    const answered = CATEGORY_CONFIG.reduce((sum, cat) => {
      const list = data[cat.id] ?? [];
      return sum + list.filter((q) => q.userNotes?.trim().length > 0).length;
    }, 0);
    const pct = total ? Math.round((answered / total) * 100) : 0;
    return {
      totalQuestions: total,
      progressPct: pct,
      filledSegments: Math.min(4, Math.ceil((pct / 100) * 4)),
    };
  }, [data]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setExpandedIndex(null); // Close any open question when switching tabs
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 font-sans flex items-center justify-center text-muted-foreground">
        Loading your interview prep…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background p-8 font-sans flex items-center justify-center text-center text-destructive">
        {error || "Couldn't find this question set."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8 font-sans flex justify-center">
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-[1400px]">
        {/* SideBar */}
        <aside className="w-full lg:w-[320px] flex-shrink-0 space-y-6">
          {/* 1. Profile / Export Card */}
          <div className="bg-surface rounded-2xl shadow-card p-6 border border-border">
            <Link
              to="/cv"
              className="text-sm text-muted-foreground flex items-center gap-2 mb-6 hover:text-foreground transition-colors"
            >
              <span>←</span> Back to Cv's
            </Link>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              {data.title || "Interview Prep"}
            </h2>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mb-6">
              📄 {data.cv?.originalName ?? "your CV"}
            </p>
           <DownloadPdf   cvId={cvId}/>
            <button className="w-full cursor-pointer bg-accent text-accent-foreground font-semibold mt-2.5 py-2.5 rounded-md hover:bg-accent/80 transition-colors flex justify-center items-center gap-2">
              <span>🔗</span> Share Questions
            </button>
          </div>

          {/* 2. Categories Card */}
          <div className="bg-surface rounded-2xl shadow-card p-6 border border-border">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
              Categories
            </h3>
            <ul className="space-y-1">
              {CATEGORY_CONFIG.map((cat) => {
                const isActive = activeCategory === cat.id;
                const count = data[cat.id]?.length ?? 0;

                return (
                  <li
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      isActive
                        ? "bg-accent/30 text-primary font-medium"
                        : "text-muted-foreground hover:bg-accent/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? "text-primary font-bold" : ""}>
                        {cat.icon}
                      </span>
                      <span>{cat.label}</span>
                    </div>
                    <span
                      className={`text-xs py-0.5 px-2 rounded-full shadow-sm ${
                        isActive
                          ? "bg-background text-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 3. Copilot Insight Card — only renders once your backend actually sends one */}
          {data.insight && (
            <div className="bg-primary rounded-2xl shadow-card p-6 border border-border relative overflow-hidden text-primary-foreground">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              <h3 className="text-sm font-bold mb-2">Copilot Insight</h3>
              <p className="text-sm text-primary-foreground/80 leading-relaxed">
                {data.insight}
              </p>
            </div>
          )}
        </aside>

        {/* MAIN AREA */}
        <main className="flex-1 max-w-[850px]">
          {/* Header Area with Progress Bar */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Interview Preparation
              </h1>
              <p className="text-muted-foreground">
                {totalQuestions} targeted questions generated for your profile.
              </p>
            </div>

            {/* Progress Bar — same 4-segment look, now driven by real notes */}
            <div className="text-right">
              <p className="text-xs font-semibold text-foreground mb-2">
                Preparation Progress · {progressPct}%
              </p>
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-8 rounded-full ${
                      i < filledSegments ? "bg-success" : "bg-accent"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Section Title */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2 bg-surface border border-border rounded-lg shadow-sm">
              <span className="text-primary font-bold text-xl">
                {activeConfig?.icon}
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-foreground">
              {activeConfig?.label}
            </h2>
            <span className="bg-surface border border-border text-foreground px-3 py-1 rounded-full text-xs font-medium shadow-sm">
              {currentQuestions.length} Questions
            </span>
          </div>

          {/* Questions List */}
          <div className="space-y-3">
            {currentQuestions.map((q, index) => (
              <QuestionCard
                key={q._id}
                index={index}
                questionText={q.questionText}
                relatedTo={q.relatedTo}
                note={q.userNotes ?? ""}
                onNoteChange={(text) => updateNote(activeCategory, q._id, text)}
                saveStatus={savingIds[q._id]}
                isExpanded={expandedIndex === index}
                onToggle={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CvQuestion;