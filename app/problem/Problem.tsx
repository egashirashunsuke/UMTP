import Choices from "~/components/Choices";
import AnswerForm from "~/components/AnswerForm";
import type { Answers } from "../routes/home";
import type { Choice } from "~/routes/question.$questionId";

type ProblemProps = {
  problemDescription?: string;
  question?: string;
  choices: Choice[];
  answers: Answers;
  image?: string;
  onAnswerChange: (label: string, value: string) => void;
};

export function Problem({
  problemDescription,
  question,
  choices,
  answers,
  image,
  onAnswerChange,
}: ProblemProps) {
  return (
    <>
      <div className="p-6">
        <section className="h-80 bg-white shadow rounded-xl p-6 space-y-2 border border-gray-200 overflow-y-auto">
          <div
            style={{
              whiteSpace: "pre-wrap", // 改行とスペースをそのまま反映
              wordBreak: "break-word", // 長い単語の途中でも折り返す
            }}
            className="text-gray-700  leading-relaxed"
          >
            <div className="text-xl font-semibold text-gray-900 ">
              次の問題記述を読んで、設問に答えなさい
            </div>
            {problemDescription?.trimStart()}
          </div>
          <div className="text-gray-700  leading-relaxed">
            <div className="text-xl font-bold">設問</div>
            {question}
          </div>
        </section>
      </div>
      <div className="display flex justify-center px-6 pb-6 gap-4 h-80">
        <section className="flex-1 bg-white shadow rounded-xl p-6 border border-gray-200">
          <img src={image} className="max-w-full max-h-full object-contain" />
        </section>
        <section className="bg-white shadow rounded-xl p-6 border border-gray-200 max-w-sm">
          <Choices choices={choices} />
        </section>
        <section className="bg-white shadow rounded-xl p-6 border border-gray-200">
          <AnswerForm
            choices={choices}
            answers={answers}
            onChange={onAnswerChange}
          />
        </section>
      </div>
    </>
  );
}
