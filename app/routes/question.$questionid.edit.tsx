import React, { useState } from "react";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { QuestionForm, type ProblemFormData } from "~/components/QuestionForm";
import type { Route } from "./+types/question.$questionid.edit";

export type Choice = {
  id: number;
  question_id: number;
  label: string;
  text: string;
};

export type QuestionData = {
  id: number;
  problem_description: string;
  question: string;
  answer_process: string;
  image: string;
  class_diagram_plantuml: string;
  choices: Choice[];
  created_at: string;
};
type LoaderData = {
  question: QuestionData;
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const loader = async ({
  params,
}: Route.LoaderArgs): Promise<LoaderData> => {
  const baseURL = import.meta.env.PROD
    ? "https://umtp-backend-1.onrender.com"
    : "http://localhost:8000";
  const id = Number(params.questionid);

  const res = await axios.get<QuestionData>(`${baseURL}/question/${id}`);

  return { question: res.data };
};

type Props = {
  loaderData: LoaderData;
};

const QuestionEditPage = (props: Props) => {
  const { loaderData } = props;

  if (!loaderData) {
    throw new Response("Not Found", { status: 404 });
  }
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: ProblemFormData) => {
    setLoading(true);

    try {
      let uploadedURL = "";
      if (data.imageFile) {
        const fileRef = ref(
          storage,
          `images/${Date.now()}_${data.imageFile.name}`
        );
        const snapshot = await uploadBytes(fileRef, data.imageFile);
        uploadedURL = await getDownloadURL(snapshot.ref);
      }

      const payload = {
        problem_description: data.problem_description,
        question: data.question,
        answer_process: data.answer_process,
        image: uploadedURL,
        class_diagram_plantuml: data.class_diagram_plantuml,
        choices: data.choices,
      };
      const baseURL = import.meta.env.PROD
        ? "https://umtp-backend-1.onrender.com"
        : "http://localhost:8000";
      const res = await axios.post(`${baseURL}/question`, payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">問題編集</h1>
      <QuestionForm
        initialData={loaderData?.question}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default QuestionEditPage;
