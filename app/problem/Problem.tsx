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
      <div className="h-90">
        <section className="m-8 bg-white shadow rounded-xl p-6 space-y-4 border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto">
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
          <p className="text-gray-700  leading-relaxed">
            <div className="text-xl font-bold">設問</div>
            {question}
          </p>
        </section>
      </div>
      <div className="display flex align-center justify-center m-8">
        <section className="bg-white shadow rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <img src={image} className="w-full max-w-sm" />
        </section>
        <div>
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
      </div>
    </>
  );
}
