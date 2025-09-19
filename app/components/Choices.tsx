import { index } from "@react-router/dev/routes";
import React from "react";
import type { Choice } from "~/routes/question.$questionId";

type ChoicesProps = {
  choices: Choice[];
};

function Choices({ choices }: ChoicesProps) {
  const sorted = React.useMemo(
    () =>
      [...choices].sort((a, b) =>
        a.label.localeCompare(b.label, "en", { sensitivity: "base" })
      ),
    [choices]
  );
  return (
    <div className="flex flex-col gap-2">
      選択肢
      {sorted.map((word, index) => (
        <div key={index}>
          {word.label}. {word.text}
        </div>
      ))}
    </div>
  );
}

export default Choices;
