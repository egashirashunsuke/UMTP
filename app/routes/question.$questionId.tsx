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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";
import { sendLog } from "~/utils/logging";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "sonner";

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

  const baseURL = import.meta.env.PROD
    ? "https://umtp-backend-1.onrender.com"
    : "http://localhost:8000";

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const handleAnswerChange = async (label: string, value: string) => {
    const newAnswers = { ...answers, [label]: value };
    setAnswers(newAnswers);

    await sendLog({
      baseURL,
      questionId: questionId ? Number(questionId) : undefined,
      studentId: isAuthenticated
        ? user?.email?.split("@")[0]?.slice(0, 8)
        : undefined,
      event_name: `answer_change`,
      answers: newAnswers,
      getToken: isAuthenticated ? () => getAccessTokenSilently() : undefined,
    });
  };

  const handleSubmit = () => {
    console.log("回答送信:", answers);
    sendLog({
      baseURL: import.meta.env.PROD
        ? "https://umtp-backend-1.onrender.com"
        : "http://localhost:8000",
      questionId: questionId ? Number(questionId) : undefined,
      studentId: isAuthenticated
        ? user?.email?.split("@")[0]?.slice(0, 8)
        : undefined,
      event_name: "submit_answer",
      answers: answers,
      getToken: isAuthenticated ? () => getAccessTokenSilently() : undefined,
    });
    sessionStorage.removeItem(`seenHints-${questionId}`);
    toast.success("回答を送信しました!");
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>解答を送信</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>解答を送信しますか?</AlertDialogTitle>
                <AlertDialogDescription>
                  解答を送信すると，現在の解答内容が保存されます。よろしいですか？
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit}>
                  送信
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="py-8 pr-8 flex-1">
        <Hintarea
          answers={answers}
          questionId={questionId ? Number(questionId) : undefined}
        />
      </div>
    </div>
  );
}
