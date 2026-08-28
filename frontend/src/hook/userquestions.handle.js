import { useEffect, useState, useCallback } from "react";
import {
  getQuestionSetsByCV,
  updateQuestionNotes,
} from "../api/Airesponse.api.js";

/**
 * Fetches the (most recent) question set generated for a given CV,
 * and exposes a way to save per-question notes with per-question
 * saving/saved/error status (for showing spinners/checkmarks in UI).
 */
export function useQuestionSet(cvId) {
  const [data, setData] = useState(null); // { _id, cv, technical, projectBased, behavioral, fieldBasics }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingIds, setSavingIds] = useState({}); // { [questionId]: "saving" | "saved" | "error" }

  useEffect(() => {
    if (!cvId) return;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const { questionSets } = await getQuestionSetsByCV(cvId);

        if (!questionSets || questionSets.length === 0) {
          setError("No questions found for this CV yet.");
          setData(null);
          return;
        }

        // most recent set for this CV (already sorted desc by backend,
        // but sort defensively just in case)
        const latest = [...questionSets].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )[0];

        setData(latest);
      } catch (err) {
        console.error("Failed to load question set:", err);
        setError(
          err?.response?.data?.error ||
            "Couldn't load your questions. Please try again."
        );
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [cvId]);

  const updateNote = useCallback(
    async (category, questionId, notes) => {
      if (!data?._id) return;

      setSavingIds((prev) => ({ ...prev, [questionId]: "saving" }));

      try {
        const { questionSet } = await updateQuestionNotes({
          id: data._id,
          category,
          questionId,
          notes,
        });

        setData(questionSet); // backend returns the full updated set
        setSavingIds((prev) => ({ ...prev, [questionId]: "saved" }));

        // clear the "saved" checkmark after a couple seconds
        setTimeout(() => {
          setSavingIds((prev) => {
            const next = { ...prev };
            delete next[questionId];
            return next;
          });
        }, 2000);
      } catch (err) {
        console.error("Failed to save note:", err);
        setSavingIds((prev) => ({ ...prev, [questionId]: "error" }));
      }
    },
    [data?._id]
  );

  return { data, loading, error, updateNote, savingIds };
}