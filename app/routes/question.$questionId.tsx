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
import { Button } from "../components/ui/button";
import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react";

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
  const [hints, setHints] = useState<string[]>(["まだヒントはありません。"]);

  const handleAnswerChange = (label: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [label]: value }));
  };

  const handleSubmit = () => {
    console.log("回答送信:", answers);
    setIsReset(true);
  };

  return (
    <div className="flex w-full h-screen">
      <div className="p-8">
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
        <div className="flex gap-2 justify-center">
          <Button onClick={handleSubmit}>回答を送信</Button>
          {loaderData.prevId ? (
            <Button asChild variant="secondary">
              <Link to={`/question/${loaderData.prevId}`}>
                <>
                  <ChevronLeftIcon /> 前の問題
                </>
              </Link>
            </Button>
          ) : (
            <Button disabled variant="secondary">
              <ChevronLeftIcon />
              前の問題
            </Button>
          )}

          {loaderData.nextId ? (
            <Button asChild variant="secondary">
              <Link to={`/question/${loaderData.nextId}`}>
                次の問題 <ChevronRightIcon></ChevronRightIcon>
              </Link>
            </Button>
          ) : (
            <Button disabled variant="secondary">
              次の問題 <ChevronRightIcon></ChevronRightIcon>
            </Button>
          )}
        </div>
      </div>
      <div className="py-8 pr-8 flex-1">
        <Hintarea
          answers={answers}
          questionId={questionId ? Number(questionId) : undefined}
          hints={hints}
          setHints={setHints}
        />
      </div>
    </div>
  );
}
