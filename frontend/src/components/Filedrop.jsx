import { useRef, useState } from "react";
import { Link } from "react-router";
import { FileCheck2, Loader2, Lock, Sparkles, UploadCloud } from "lucide-react";

const ACCEPTED_EXTENSIONS = [".pdf"];
const MAX_SIZE_MB = 3;

export default function Filedrop({ onFileSelected, fileName, status, cvId }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const isBusy = status === "uploading" || status === "processing";
  const isDone = status === "done";

  const validateAndEmit = (file) => {
    if (!file) return;
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setError("Please upload a PDF file.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File is larger than ${MAX_SIZE_MB}MB.`);
      return;
    }

    setError("");
    onFileSelected(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (isBusy || isDone) return;
    validateAndEmit(e.dataTransfer.files?.[0]);
  };

  // ---- DONE STATE — same box, revamped content, no upload UI ----
  if (isDone) {
    return (
      <div className="flex flex-col items-center rounded-2xl border-2 border-success/40 bg-surface p-10 text-center shadow-card sm:p-16">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-success/15">
          <FileCheck2 size={36} className="text-success" />
        </div>

        <h3 className="text-xl font-bold text-foreground sm:text-2xl">
          Your 50 questions are ready!
        </h3>

        <p className="mt-1 max-w-sm text-muted-foreground">
          Generated from <span className="font-medium text-foreground">{fileName}</span> and saved to your dashboard.
        </p>

        <Link
          to={`/cv/${cvId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center gap-2 rounded-lg bg-success px-6 py-2.5 text-sm font-semibold text-success-foreground shadow-sm transition-all hover:opacity-90"
        >
          <Sparkles size={16} />
          View Your Questions
        </Link>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-3 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Upload a different CV
        </button>

        {/* hidden input so "Upload a different CV" can trigger a fresh pick */}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(",")}
          className="hidden"
          onChange={(e) => validateAndEmit(e.target.files?.[0])}
        />
      </div>
    );
  }

  // ---- IDLE / UPLOADING / PROCESSING / ERROR STATE ----
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!isBusy) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !isBusy && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !isBusy) {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      className={`group relative flex flex-col items-center rounded-2xl border-2 border-dashed bg-surface p-10 text-center shadow-card transition-all duration-300 sm:p-16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        isBusy ? "cursor-default" : "cursor-pointer"
      } ${
        isDragging
          ? "border-primary bg-accent/40"
          : "border-border hover:border-primary/50 hover:shadow-lg"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS.join(",")}
        className="hidden"
        disabled={isBusy}
        onChange={(e) => validateAndEmit(e.target.files?.[0])}
      />

      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-accent transition-colors duration-300">
        {isBusy ? (
          <Loader2 size={36} className="animate-spin text-primary" />
        ) : fileName ? (
          <FileCheck2 size={36} className="text-success" />
        ) : (
          <UploadCloud
            size={36}
            className="text-primary transition-transform duration-300 group-hover:-translate-y-0.5"
          />
        )}
      </div>

      <h3 className="text-xl font-bold text-foreground sm:text-2xl">
        {status === "uploading" && "Uploading your CV…"}
        {status === "processing" && "Generating your questions…"}
        {(status === "idle" || status === "error") && (fileName || "Drag & Drop your CV")}
      </h3>

      <p className="mt-1 text-muted-foreground">
        {status === "idle" || status === "error"
          ? "Supports PDF (Max 3MB)"
          : "This usually takes a few seconds."}
      </p>

      {error && (
        <p className="mt-2 text-sm font-medium text-destructive">{error}</p>
      )}

      {!isBusy && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
          className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary-hover hover:shadow-md"
        >
          {fileName ? "Choose a different file" : "Browse Files"}
        </button>
      )}

      <div className="mt-5 flex items-center gap-1.5 text-muted-foreground opacity-70">
        <Lock size={14} />
        <span className="text-xs font-medium uppercase tracking-wider">
          Protected by Clerk
        </span>
      </div>
    </div>
  );
}