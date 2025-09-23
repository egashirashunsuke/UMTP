import React from "react";
import type { Answers } from "../routes/home";
import type { Choice } from "~/routes/question.$questionId";

type AnswerFormProps = {
  choices: Choice[];
  answers: Answers;
  onChange: (label: string, value: string) => void;
};
function AnswerForm({ choices, answers, onChange }: AnswerFormProps) {
  const sorted = React.useMemo(
    () =>
      [...choices].sort((a, b) =>
        a.label.localeCompare(b.label, "en", { sensitivity: "base" })
      ),
    [choices]
  );
  return (
    <div>
      <div className="flex flex-col gap-2">
        解答欄
        {sorted.map((_, idx) => {
          const label = String.fromCharCode(97 + idx); // a, b, c...
          return (
            <div key={label}>
              {label}：
              <select
                value={answers[label] ?? ""}
                onChange={(e) => onChange(label, e.target.value)}
              >
                <option value="">未選択</option>
                {choices.map((ch) => (
                  <option key={ch.label} value={`${ch.label}`}>
                    {ch.label}. {ch.text}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AnswerForm;
