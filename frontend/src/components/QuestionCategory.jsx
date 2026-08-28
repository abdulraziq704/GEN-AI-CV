import React from "react";

 
export default function QuestionCategory({
  icon: Icon,
  badgeClass,
  iconClass,
  numberClass,
  title,
  questions,
  moreCount,
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-card transition-shadow hover:shadow-lg">
      <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${badgeClass}`}
        >
          <Icon size={20} className={iconClass} />
        </span>
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
      </div>

      <ul className="flex-1 space-y-3.5">
        {questions.map((q) => (
          <li key={q.number} className="flex items-start gap-2">
            <span
              className={`mt-0.5 shrink-0 text-sm font-semibold tabular-nums ${numberClass}`}
            >
              {String(q.number).padStart(2, "0")}.
            </span>
            <span className="text-sm text-muted-foreground">{q.text}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 border-t border-border pt-3 text-right">
        <span className="text-xs font-medium text-muted-foreground">
          + {moreCount} more questions
        </span>
      </div>
    </div>
  );
}