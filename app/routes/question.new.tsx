import React, { useState } from "react";
import axios from "axios";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { QuestionForm, type ProblemFormData } from "~/components/QuestionForm";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const storage = getStorage(app);

export default function QuestionNew() {
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
        answer_maggings: data.answer_mappings,
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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/questions">問題一覧</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/questions">問題登録</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <QuestionForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
