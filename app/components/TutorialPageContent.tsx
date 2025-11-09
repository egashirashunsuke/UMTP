import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Problem } from "../problem/Problem";
import Hintarea from "~/components/Hintarea";
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
import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react";
import { sendLog } from "~/utils/logging";
import { useTour } from "@reactour/tour";
import type { LoaderData } from "~/routes/tutorial";
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

type Props = {
  loaderData: LoaderData;
};

export default function TutorialPageContent({ loaderData }: Props) {
  if (!loaderData) {
    throw new Response("Not Found", { status: 404 });
  }
  const questionId = 1;
  const [answers, setAnswers] = useState<Record<string, string>>(
    Object.fromEntries(
      loaderData.question.choices.map((c: Choice) => [
        c.label.toLowerCase(),
        "",
      ])
    )
  );
  const [hints, setHints] = useState<string[]>([]);
  const [everOpenHints, setEverOpenHints] = useState<number[]>([]);

  const { setIsOpen } = useTour();

  const handleAnswerChange = async (label: string, value: string) => {
    const newAnswers = { ...answers, [label]: value };
    setAnswers(newAnswers);
    const baseURL = import.meta.env.PROD
      ? "https://umtp-backend-1.onrender.com"
      : "http://localhost:8000";
    await sendLog({
      baseURL,
      questionId: questionId ? Number(questionId) : undefined,
      event_name: `answer_change`,
      answers: newAnswers,
      seenHints: everOpenHints,
      hints: hints,
    });
  };

  const handleSubmit = () => {
    console.log("回答送信:", answers);
    sendLog({
      baseURL: import.meta.env.PROD
        ? "https://umtp-backend-1.onrender.com"
        : "http://localhost:8000",
      questionId: questionId ? Number(questionId) : undefined,
      event_name: "submit_answer",
      answers: answers,
      seenHints: everOpenHints,
      hints: hints,
    });
    setEverOpenHints([]);
    sessionStorage.removeItem(`seenHints-${questionId}`);
    setHints([]);
    toast.success("回答を送信しました！");
  };

  return (
    <div className="all-page">
      <div className="flex w-full h-screen">
        <div className="p-8">
          <div className="flex gap-80">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink>チュートリアル</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Button onClick={() => setIsOpen(true)}>
              チュートリアルを始める
            </Button>
          </div>

          <div className="question-area">
            <Problem
              problemDescription={loaderData.question.problem_description}
              question={loaderData.question.question}
              choices={loaderData.question.choices}
              answers={answers}
              image={loaderData.question.image}
              onAnswerChange={handleAnswerChange}
            />
          </div>
          <div className="flex gap-2 justify-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div className="submit-answer-button">
                  <Button>回答を送信</Button>
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>回答を送信しますか?</AlertDialogTitle>
                  <AlertDialogDescription>
                    回答を送信すると，現在の回答内容が保存されます。よろしいですか？
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

        <div className="hint-area py-8 pr-8 flex-1">
          <Hintarea
            answers={answers}
            questionId={questionId ? Number(questionId) : undefined}
            hints={hints}
            setHints={setHints}
            everOpenHints={everOpenHints}
            setEverOpenHints={setEverOpenHints}
          />
        </div>
      </div>
    </div>
  );
}
