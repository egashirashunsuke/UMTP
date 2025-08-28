import { useState } from "react";

export type ProblemFormData = {
  problem_description: string;
  question: string;
  imageFile: File | null;
  class_diagram_plantuml: string;
  choices: { label: string; text: string }[];
  answer_process: string;
};

export const QuestionForm = ({
  initialData,
  onSubmit,
  loading,
}: {
  initialData?: Partial<ProblemFormData>;
  onSubmit: (data: ProblemFormData) => void;
  loading: boolean;
}) => {
  const [problemDescription, setProblemDescription] = useState(
    initialData?.problem_description || ""
  );
  const [question, setQuestion] = useState(initialData?.question || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(
    initialData?.imageFile ? URL.createObjectURL(initialData.imageFile) : ""
  );
  const [classdiagramPlantUML, setClassdiagramPlantUML] = useState(
    initialData?.class_diagram_plantuml || ""
  );
  const [choices, setChoices] = useState(
    initialData?.choices || [{ label: "", text: "" }]
  );
  const [answerProcess, setAnswerProcess] = useState(
    initialData?.answer_process || ""
  );

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      problem_description: problemDescription,
      question,
      imageFile,
      class_diagram_plantuml: classdiagramPlantUML,
      choices,
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
    </>
  );
};
