import api from "./AxiosClient";

/**
 * Uploads the CV file (multipart/form-data).
 * Backend field name is "cv" — must match multer's uploadCV.single("cv").
 * Public endpoint — no auth needed, guest can upload directly.
 */
export const uploadCV = async (file) => {
  const formData = new FormData();
  formData.append("cv", file);

  const { data } = await api.post("/cv/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data; // { cv: { _id, fileUrl, originalName, status, ... } }
};

export const getallCvs = async () => {
  const { data } = await api.get("/cv");
  return data;
};

export const deleteCv=async (id) => {
  const {data}= await api.delete(`/cv/${id}`)
  return data;
  
}