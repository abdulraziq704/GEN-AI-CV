import React, { useState } from "react";
import { AlertCircle, Check, Loader2,Sparkles } from "lucide-react";

const STATUS_CONFIG = {
  saving: { icon: Loader2, iconClass: "animate-spin text-muted-foreground", text: "Saving…" },
  saved: { icon: Check, iconClass: "text-success", text: "Saved" },
  error: { icon: AlertCircle, iconClass: "text-destructive", text: "Couldn't save — check your connection" },
};

const QuestionCard = ({
  questionText,
  relatedTo,
  index,
  isExpanded,
  onToggle,
  note,
  onNoteChange,
  saveStatus,
}) => {
  const status = STATUS_CONFIG[saveStatus];
   const [copied, setCopied] = useState(false);

  const handleSolveWithAI = async (e) => {
    e.stopPropagation(); // don't let this trigger the card's expand/collapse

    try {
      await navigator.clipboard.writeText(questionText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard write failed:", err);
    }

    window.open(
      `https://chatgpt.com/?q=${encodeURIComponent(questionText)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div
      onClick={onToggle}
      className={`bg-surface rounded-2xl border transition-all cursor-pointer ${
        isExpanded
          ? "border-primary shadow-card p-6"
          : "border-border hover:border-primary/50 p-4"
      }`}
    >
      {/* Header Area (Always Visible) */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3
            className={`font-medium text-foreground leading-relaxed ${isExpanded ? "text-lg mb-4" : "text-base"}`}
          >
            {questionText}
          </h3>
          <span className="inline-block bg-accent/50 text-muted-foreground text-xs px-2 py-1 rounded-sm">
            {relatedTo}
          </span>
        </div>

          <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSolveWithAI}
            className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            <Sparkles size={12} />
            {copied ? "Copied!" : "Solve with AI"}
          </button>

          <div className="bg-accent text-accent-foreground font-semibold px-3 py-1 rounded-md text-sm">
            #{index + 1}
          </div>
        </div>
      </div>

      {/* Expanded Content Area */}
      {isExpanded && (
        <div
          onClick={(e) => e.stopPropagation()} // Prevents clicking inside the textarea from collapsing the card
          className="mt-2 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Notes Text Area — now controlled from the parent, backed by real data */}
          <textarea
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="Draft your answer or add notes here..."
            className="w-full bg-accent/30 text-foreground placeholder:text-muted-foreground border-none rounded-xl p-4 min-h-[120px] outline-none focus:ring-2 focus:ring-primary transition-all resize-y"
          />

          <div className="mt-1.5 flex h-4 items-center gap-1.5 text-xs text-muted-foreground">
            {status ? (
              <>
                <status.icon size={12} className={status.iconClass} />
                <span>{status.text}</span>
              </>
            ) : (
              <span>Your notes save automatically.</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;