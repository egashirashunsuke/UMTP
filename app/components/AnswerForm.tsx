import React from 'react'
import type { Answers } from "../routes/home";


type AnswerFormProps = {
  choices: string[];
  answers: Answers;
  onChange: (label: string, value: string) => void;
}
function AnswerForm({ choices, answers, onChange }: AnswerFormProps) {
  return (
    <div>AnswerForm
       {choices.map((_, idx) => {
        const label = String.fromCharCode(97 + idx);
        return (
          <div key={label}>
            {label}-
            <input
              type="text"
              value={answers[label] || ""}
              onChange={e => onChange(label, e.target.value)}
            />
          </div>
        );
      })}
    </div>
  )
}

export default AnswerForm