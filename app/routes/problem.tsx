import React, { useState } from "react";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default function ProblemSetting() {
  const [problemDescription, setProblemDescription] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [classdiagramPlantUML, setClassdiagramPlantUML] = useState<string>("");
  const [choices, setChoices] = useState<{ label: string; text: string }[]>([
    { label: "", text: "" },
  ]);
  const [answerProcess, setAnswerProcess] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const handleChoiceChange = (
    idx: number,
    key: "label" | "text",
    value: string
  ) => {
    setChoices((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, [key]: value } : c))
    );
  };

  const addChoice = () =>
    setChoices((prev) => [...prev, { label: "", text: "" }]);
  const removeChoice = (idx: number) =>
    setChoices((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev
    );

  // プレビューのみ生成し、アップロードは Submit 時に行う
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      let uploadedURL = "";
      if (imageFile) {
        const fileRef = ref(storage, `images/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(fileRef, imageFile);
        uploadedURL = await getDownloadURL(snapshot.ref);
      }

      const payload = {
        problem_description: problemDescription,
        question: question,
        answer_process: answerProcess,
        image: uploadedURL,
        class_diagram_plantuml: classdiagramPlantUML,
        choices: choices,
      };
      const baseURL = import.meta.env.PROD
        ? "https://umtp-backend-1.onrender.com"
        : "http://localhost:8000";
      const res = await axios.post(`${baseURL}/question`, payload);
      setResult("送信成功: " + JSON.stringify(res.data));
    } catch (e: any) {
      setResult("送信失敗: " + (e.message || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">問題設定フォーム</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-1">問題記述</label>
          <textarea
            className="w-full border rounded p-2"
            rows={4}
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">問題</label>
          <textarea
            className="w-full border rounded p-2"
            rows={4}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">画像</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {previewUrl && (
            <div className="mt-2">
              プレビュー:
              <br />
              <img src={previewUrl} alt="preview" className="max-w-xs" />
            </div>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-1">
            クラス図 (PlantUML)
          </label>
          <textarea
            className="w-full border rounded p-2"
            rows={4}
            value={classdiagramPlantUML}
            onChange={(e) => setClassdiagramPlantUML(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">選択肢リスト</label>
          {choices.map((choice, idx) => (
            <div key={idx} className="flex items-center mb-2 gap-2">
              <input
                className="border rounded p-1 w-16"
                type="text"
                placeholder="ラベル"
                value={choice.label}
                onChange={(e) =>
                  handleChoiceChange(idx, "label", e.target.value)
                }
                required
              />
              <input
                className="border rounded p-1 flex-1"
                type="text"
                placeholder="ワード"
                value={choice.text}
                onChange={(e) =>
                  handleChoiceChange(idx, "text", e.target.value)
                }
                required
              />
              <button
                type="button"
                className="ml-2 text-red-500"
                onClick={() => removeChoice(idx)}
                disabled={choices.length === 1}
              >
                削除
              </button>
            </div>
          ))}
          <button
            type="button"
            className="mt-2 px-2 py-1 bg-blue-200 rounded"
            onClick={addChoice}
          >
            選択肢を追加
          </button>
        </div>
        <div>
          <label className="block font-semibold mb-1">回答プロセス</label>
          <textarea
            className="w-full border rounded p-2"
            rows={4}
            value={answerProcess}
            onChange={(e) => setAnswerProcess(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "送信中..." : "送信"}
        </button>
      </form>
      {result && <div className="mt-4 text-sm">{result}</div>}
    </div>
  );
}
