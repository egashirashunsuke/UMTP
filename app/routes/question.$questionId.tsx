import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Problem } from "../problem/Problem";
import Hintarea from "~/components/Hintarea";
import axios from "axios";
import type { Route } from "./+types/question.$questionId";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
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
  prevId: number | null;
};

export async function loader({
  params,
}: Route.LoaderArgs): Promise<LoaderData> {
  const baseURL = import.meta.env.PROD
    ? "https://umtp-backend-1.onrender.com"
    : "http://localhost:8000";
  const id = Number(params.questionId);

  const [qRes, nextRes, prevRes] = await Promise.all([
    axios.get<QuestionData>(`${baseURL}/question/${id}`),
    axios
      .get<{ id: number }>(`${baseURL}/question/${id}/next`)
      .then((r) => r.data.id)
      .catch(() => null),
    axios
      .get<{ id: number }>(`${baseURL}/question/${id}/prev`)
      .then((r) => r.data.id)
      .catch(() => null),
  ]);

  return {
    question: qRes.data,
    nextId: nextRes,
    prevId: prevRes,
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
  const [isReset, setIsReset] = useState(false);
  const handleAnswerChange = (label: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [label]: value }));
  };

  const handleSubmit = () => {
    console.log("回答送信:", answers);
    setIsReset(true);
  };

  return (
    <div className="flex w-full min-h-screen">
      <div className="w-7xl m-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/questions">問題一覧</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>問題{questionId}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Problem
          problemDescription={loaderData.question.problem_description}
          question={loaderData.question.question}
          choices={loaderData.question.choices}
          answers={answers}
          image={loaderData.question.image}
          onAnswerChange={handleAnswerChange}
        />
        <button
          onClick={handleSubmit}
          className="w-full md:w-auto px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded shadow-md transition"
        >
          回答を送信
        </button>
        {loaderData.prevId ? (
          <Link
            to={`/question/${loaderData.prevId}`}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded shadow"
          >
            ← 前の問題
          </Link>
        ) : (
          <button
            disabled
            className="px-4 py-2 bg-gray-100 text-gray-400 rounded cursor-not-allowed"
          >
            ← 前の問題
          </button>
        )}

        {loaderData.nextId ? (
          <Link
            to={`/question/${loaderData.nextId}`}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow"
          >
            次の問題 →
          </Link>
        ) : (
          <button
            disabled
            className="px-4 py-2 bg-gray-100 text-gray-400 rounded cursor-not-allowed"
          >
            次の問題 →
          </button>
        )}
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
