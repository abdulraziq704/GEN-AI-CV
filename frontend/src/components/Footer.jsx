import { FileStack } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <FileStack size={14} />
          <span>CareerAI Copilot</span>
        </div>
        <span>© {new Date().getFullYear()} CareerAI Tool. All rights reserved.</span>
      </div>
    </footer>
  );
}