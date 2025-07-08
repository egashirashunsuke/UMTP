
import React, { useState } from "react";
import { Problem } from "../problem/Problem";
import Hintarea from "~/components/Hintarea";
import axios from "axios";
import type { Route } from "./+types/question.$questionId";
import type { LoaderFunction } from "react-router";


export type Choice = {
  id: number;
  question_id: number;
  label: string;
  text: string;
};

export type QuestionData = {
  id: number;
  problem_description: string;
  question: string;
  answer: string;
  image: string;
  choices: Choice[];
  created_at: string;
};

// loader の戻り値を QuestionData 型として定義
export async function loader({
  params,
}: Route.LoaderArgs): Promise<QuestionData> {
  const baseURL = import.meta.env.PROD
    ? "https://umtp-backend-1.onrender.com"
    : "http://localhost:8000";
  const res = await axios.get<QuestionData>(
    `${baseURL}/question/${params.questionId}`
  );
  return res.data;
}


export default function QuestionPage({ loaderData }: Route.ComponentProps) {
  if (!loaderData) {
    throw new Response("Not Found", { status: 404 }); 
  }
  console.log("loaderData", loaderData);
  console.log("loaderData", loaderData.choices);


  const [answers, setAnswers] = useState<Record<string, string>>(
    Object.fromEntries(
      loaderData.choices.map((c:Choice) => [c.label.toLowerCase(), ""])
    )
  );

  const handleAnswerChange = (label: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [label]: value }));
  };

  const choiceTexts = loaderData.choices.map((c:Choice) => c.text);

  return (
    <div className="flex w-full min-h-screen">
      <div className="w-7xl">
        <Problem
          problemDescription={loaderData.problem_description}
          question={loaderData.question}
          choices={choiceTexts}
          answers={answers}
          onAnswerChange={handleAnswerChange}
        />
      </div>
      <div className="w-lg m-8">
        <Hintarea answers={answers} />
      </div>
    </div>
  );
}
