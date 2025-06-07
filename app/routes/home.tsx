import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { Problem } from "../problem/Problem";
import Hintarea from "~/components/Hintarea";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const ChoiceList = ['診断指標','基本データ','診断結果',"会社情報",'財務データ','自社情報','業種']

export type Answers = { [key: string]: string };

export default function Home() {

  const labels = ChoiceList.map((_, i) => String.fromCharCode(97 + i));

  const [answers, setAnswers] = useState<Answers>(
    Object.fromEntries(labels.map(label => [label, ""]))
  );

  const handleAnswerChange = (label: string, value: string) => {
    setAnswers(prev => ({ ...prev, [label]: value }));
  }


  return (
    <>
      {/* <Welcome /> */}
      <div className="display flex">
        <div className="w-5xl">
          <Problem 
            choices={ChoiceList}
            answers={answers}
            onAnswerChange={handleAnswerChange}/>
        </div>
        <div className="w-sm">
          <Hintarea answers={answers}/>
        </div>
      </div>
    </>
  );
}
