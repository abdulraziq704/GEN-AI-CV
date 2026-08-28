import { useState } from "react";
import { downloadQuestionSetPDF } from "../api/Airesponse.api.js"; // adjust path

const DownloadPdf = ({ cvId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExport = async () => {
    if (!cvId || loading) return;
    setLoading(true);
    setError(null);

    try {
      const blob = await downloadQuestionSetPDF(cvId);

      // Create a temporary object URL and trigger a browser download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.href = url;
      link.download = `interview-prep-${cvId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Free memory once the download has been triggered
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF export failed:", err);
      setError(
        err?.response?.status === 404
          ? "No questions found for this CV yet."
          : "Couldn't generate the PDF. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleExport}
        disabled={loading}
        className="w-full bg-primary cursor-pointer text-primary-foreground font-semibold py-2.5 rounded-md mb-1 hover:bg-primary-hover transition-colors flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <span>📄</span> Export to PDF
          </>
        )}
      </button>

      {error && (
        <p className="text-red-500 text-sm mb-2">{error}</p>
      )}
    </div>
  );
};

export default DownloadPdf;