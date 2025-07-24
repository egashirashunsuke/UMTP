import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Problem } from "../problem/Problem";
import Hintarea from "~/components/Hintarea";
import axios from "axios";
import type { Route } from "./+types/question.$questionId";

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
type LoaderData = {
  question: QuestionData;
  nextId: number | null;
};

export async function loader({
  params,
}: Route.LoaderArgs): Promise<LoaderData> {
  const baseURL = import.meta.env.PROD
    ? "https://umtp-backend-1.onrender.com"
    : "http://localhost:8000";
  const id = Number(params.questionId);

  // 並列で「問題」と「次の問題ID」を取得
  const [qRes, nextRes] = await Promise.all([
    axios.get<QuestionData>(`${baseURL}/question/${id}`),
    axios
      .get<{ id: number }>(`${baseURL}/question/${id}/next`)
      .then((r) => r.data.id)
      .catch(() => null),
  ]);

  return {
    question: qRes.data,
    nextId: nextRes,
  };
}

export default function QuestionPage({ loaderData }: Route.ComponentProps) {
  if (!loaderData) {
    throw new Response("Not Found", { status: 404 });
  }
  const { questionId } = useParams<{ questionId: string }>();
  const [answers, setAnswers] = useState<Record<string, string>>(
    Object.fromEntries(
      loaderData.question.choices.map((c: Choice) => [
        c.label.toLowerCase(),
        "",
      ])
    )
  );
  const [nextQuestionId, setNextQuestionId] = useState<number | null>(null);
  const handleAnswerChange = (label: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [label]: value }));
  };

  return (
    <div className="flex w-full min-h-screen">
      <div className="w-7xl">
        <Link to="/questions">問題一覧</Link>
        <Problem
          problemDescription={loaderData.question.problem_description}
          question={loaderData.question.question}
          choices={loaderData.question.choices}
          answers={answers}
          image={loaderData.question.image}
          onAnswerChange={handleAnswerChange}
        />
        <button>回答を送信</button>
        <Link to={`/question/${loaderData.nextId}`}>次の問題へ</Link>
      </div>
      <div className="w-lg m-8">
        <Hintarea
          answers={answers}
          questionId={questionId ? Number(questionId) : undefined}
        />
      </div>
    </div>
  );
}
