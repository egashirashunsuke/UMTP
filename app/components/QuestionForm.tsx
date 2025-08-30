import { useEffect, useState } from "react";
import type { QuestionData } from "~/routes/question.$questionid.edit";

export type ProblemFormData = {
  problem_description: string;
  question: string;
  imageFile: File | null;
  class_diagram_plantuml: string;
  choices: { code: string; text: string }[];
  answer_mappings: { blank: string; choice_code: string }[];
  answer_process: string;
};

export const QuestionForm = ({
  initialData,
  onSubmit,
  loading,
}: {
  initialData?: QuestionData;
  onSubmit: (data: ProblemFormData) => void;
  loading: boolean;
}) => {
  const [problemDescription, setProblemDescription] = useState(
    initialData?.problem_description || ""
  );
  const [question, setQuestion] = useState(initialData?.question || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(
    initialData?.image ? initialData?.image : ""
  );
  const [classdiagramPlantUML, setClassdiagramPlantUML] = useState(
    initialData?.class_diagram_plantuml || ""
  );
  const [choices, setChoices] = useState(
    (initialData?.choices || [{ text: "" }]).map((c, idx) => ({
      code: String.fromCharCode(65 + idx), // A, B, C...
      text: c.text,
    }))
  );
  const [answerMappings, setAnswerMappings] = useState<
    { blank: string; choice_code: string }[]
  >([]);
  const [answerProcess, setAnswerProcess] = useState(
    initialData?.answer_process || ""
  );

  useEffect(() => {
    const newblanks = Array.from({ length: choices.length }, (_, i) =>
      String.fromCharCode(97 + i)
    );
    setAnswerMappings((prev) =>
      newblanks.map((s, i) => prev[i] || { blank: s, choice_code: "" })
    );
  }, [choices]);

  const handleChoiceChange = (
    idx: number,
    key: "code" | "text",
    value: string
  ) => {
    setChoices((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, [key]: value } : c))
    );
  };

  const addChoice = () =>
    setChoices((prev) => [
      ...prev,
      { code: String.fromCharCode(65 + prev.length), text: "" },
    ]);

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
  const handleMappingChange = (idx: number, value: string) => {
    setAnswerMappings((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, choice_code: value } : m))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      problem_description: problemDescription,
      question,
      imageFile,
      class_diagram_plantuml: classdiagramPlantUML,
      choices: choices.map((c, idx) => ({
        code: String.fromCharCode(65 + idx),
        text: c.text,
      })),
      answer_mappings: answerMappings, // ★追加
      answer_process: answerProcess,
    });
  };
  return (
    <>
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
          <label className="block font-semibold mb-1">図の画像</label>
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
            図の文字表現(PlantUMLなど)
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
                value={String.fromCharCode(65 + idx)}
                readOnly
              />
              <input
                className="border rounded p-1 flex-1"
                type="text"
                placeholder="選択肢"
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
          <label className="block font-semibold mb-1">
            解答（穴埋めマッピング）
          </label>
          {answerMappings.map((m, idx) => (
            <div key={m.blank} className="flex items-center mb-2 gap-2">
              <span className="w-8 font-bold">{m.blank}</span>
              <select
                className="border rounded p-1"
                value={m.choice_code}
                onChange={(e) => handleMappingChange(idx, e.target.value)}
              >
                <option value="">未選択</option>
                {choices.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.text}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div>
          <label className="block font-semibold mb-1">解答プロセス</label>
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
    </>
  );
};
