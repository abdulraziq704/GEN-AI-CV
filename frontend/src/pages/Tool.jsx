import { useState } from "react";
import {
  BookmarkPlus,
  Brain,
  Briefcase,
  Code2,
  Download,
  Sparkles,
  Trophy,
} from "lucide-react";

import Filedrop from "../components/Filedrop";
import { uploadCV } from "../api/cv.api";
import { generateQuestions } from "../api/Airesponse.api";

// backend keys -> display config (icon/colors/title)
// backend se sirf { technical, projectBased, behavioral, fieldBasics }: [{number, text}] aata hai
const CATEGORY_CONFIG = {
  technical: {
    title: "Technical Skills",
    icon: Code2,
    badgeClass: "bg-primary",
    iconClass: "text-primary-foreground",
    numberClass: "text-primary",
  },
  projectBased: {
    title: "Project-Based",
    icon: Trophy,
    badgeClass: "bg-success",
    iconClass: "text-success-foreground",
    numberClass: "text-success",
  },
  behavioral: {
    title: "Behavioral / Soft Skills",
    icon: Brain,
    badgeClass: "bg-tertiary",
    iconClass: "text-tertiary-foreground",
    numberClass: "text-tertiary",
  },
  fieldBasics: {
    title: "Field Basics",
    icon: Briefcase,
    badgeClass: "bg-muted",
    iconClass: "text-muted-foreground",
    numberClass: "text-foreground",
  },
};

// Converts the raw questionSet from the backend into the shape
// QuestionCategory expects to render.
function toDisplayCategories(questionSet) {
  return Object.entries(CATEGORY_CONFIG)
    .filter(([key]) => Array.isArray(questionSet?.[key]))
    .map(([key, config]) => ({
      key,
      ...config,
      questions: questionSet[key],
    }));
}

export default function Tool() {
  const [status, setStatus] = useState("idle"); // idle | uploading | processing | done | error
  const [fileName, setFileName] = useState("");
  const [questionSet, setQuestionSet] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileSelected = async (file) => {
    setFileName(file.name);
    setErrorMsg("");
    setStatus("uploading");

    try {
      // 1. Upload CV to backend -> ImageKit -> get cvId
      const { cv } = await uploadCV(file);

      setStatus("processing");

      // 2. Ask backend to parse + generate questions for that CV
      const { questionSet: generatedSet } = await generateQuestions({
        cvId: cv._id,
      });

      setQuestionSet(generatedSet);
      setStatus("done");
    } catch (err) {
      console.error("CV -> Questions flow failed:", err);
      setErrorMsg(
        err?.response?.data?.error ||
          "Something went wrong while generating your questions. Please try again."
      );
      setStatus("error");
    }
  };

  // const displayCategories = questionSet ? toDisplayCategories(questionSet) : [];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="relative flex-1 overflow-hidden">
        {/* subtle decorative accents — static, not animated */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="pointer-events-none absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-success/10 blur-[100px]" />

       

        {/* upload */}
        <section className="relative z-10 mx-auto max-w-4xl px-6 py-16">
          <Filedrop
            onFileSelected={handleFileSelected}
            fileName={fileName}
            status={status}
            cvId={questionSet?.cv}
          />
          {status === "error" && (
            <p className="mt-4 text-center text-sm font-medium text-destructive">
              {errorMsg}
            </p>
          )}
        </section>

       
      </main>
    </div>
  );
}