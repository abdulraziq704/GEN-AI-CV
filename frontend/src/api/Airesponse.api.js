import api from "./AxiosClient.js";

/**
 * Triggers question generation for an already-uploaded CV.
 * Backend parses the PDF and calls Gemini itself — frontend only
 * needs to send the cvId it got back from uploadCV().
 * Public endpoint — guest can call this without logging in.
 */
export const generateQuestions = async ({ cvId }) => {
  const { data } = await api.post("/ai/generate", { cvId });
  return data; // { questionSet: {...} }
};

export const getMyQuestionSets = async () => {
  const { data } = await api.get("/ai/");
  return data; // { questionSets: [...] }
};

/** Gets one question set by its own _id. */
export const getQuestionSetById = async (id) => {
  const { data } = await api.get(`/ai/${id}`);
  return data; // { questionSet: {...} }
};

/** Gets all question sets generated for one specific CV. */
export const getQuestionSetsByCV = async (cvId) => {
  const { data } = await api.get(`/ai/cv/${cvId}`);
  return data; // { questionSets: [...] }
};

/** Saves the notes drafted under one specific question. */
export const updateQuestionNotes = async ({
  id,
  category,
  questionId,
  notes,
}) => {
  const { data } = await api.patch(
    `/ai/${id}/${category}/${questionId}/notes`,
    {
      notes,
    },
  );
  return data; // { questionSet: {...} }
};

export const downloadQuestionSetPDF = async (cvId) => {
  try {
    const res = await api.get(`/ai/cv/${cvId}/download-pdf`, {
      responseType: "blob",
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
