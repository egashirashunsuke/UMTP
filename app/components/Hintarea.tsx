import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  ChevronDown,
  ChevronRight,
  Lightbulb,
  BookOpen,
  Target,
  AlertCircleIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { HiOutlineHandThumbUp } from "react-icons/hi2";
import { HiOutlineHandThumbDown } from "react-icons/hi2";
import { HiMiniHandThumbUp } from "react-icons/hi2";
import { HiMiniHandThumbDown } from "react-icons/hi2";

import { Loader2Icon } from "lucide-react";
import { sendLog } from "~/utils/logging";

export type Answers = { [key: string]: string };

type HintareaProps = {
  answers?: Answers;
  questionId?: number;
  hints: string[];
  setHints: React.Dispatch<React.SetStateAction<string[]>>;
  everOpenHints: number[];
  setEverOpenHints: React.Dispatch<React.SetStateAction<number[]>>;
};

type HintResponse = {
  hints: string[];
};

function Hintarea({
  answers,
  questionId,
  hints,
  setHints,
  everOpenHints,
  setEverOpenHints,
}: HintareaProps) {
  const [isAnswerProgressCorrect, setIsAnswerProgressCorrect] = useState(true);
  const [loading, setLoading] = useState(false);
  const [nowOpenHints, setNowOpenHints] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<
    Record<number, "up" | "down" | null>
  >({});

  useEffect(() => {
    if (questionId != null) {
      const saved = sessionStorage.getItem(`seenHints-${questionId}`);
      if (saved) {
        setEverOpenHints(JSON.parse(saved));
      } else {
        setEverOpenHints([]);
      }
    }
  }, [questionId]);

  useEffect(() => {
    sessionStorage.setItem(
      `seenHints-${questionId}`,
      JSON.stringify(everOpenHints)
    );
  }, [everOpenHints, questionId]);

  useEffect(() => {
    if (questionId != null) {
      setEverOpenHints([]);
      sessionStorage.removeItem(`seenHints-${questionId}`);
    }
  }, [questionId]);

  const createHint = async () => {
    setLoading(true);
    try {
      const baseURL = import.meta.env.PROD
        ? "https://umtp-backend-1.onrender.com"
        : "http://localhost:8000";

      const checkRes = await axios.post<{ correct: boolean; message?: string }>(
        `${baseURL}/question/${questionId}/check`,
        { answers }
      );

      if (!checkRes.data.correct) {
        setIsAnswerProgressCorrect(false);
        setHints([
          "現在の回答には誤りがあります。修正してから再度ヒントを要求してください。",
        ]);
        return;
      }

      setIsAnswerProgressCorrect(true);
      const hintRes = await axios.post<HintResponse>(
        `${baseURL}/question/${questionId}/hints`,
        { answers }
      );
      setHints(hintRes.data.hints);

      await sendLog({
        baseURL,
        questionId,
        event_name: "hint_request",
        answers,
        seenHints: everOpenHints,
        hints: hintRes.data.hints,
      });
    } catch (e) {
      console.error("通信失敗", e);
      setHints(["通信失敗"]);
    } finally {
      setLoading(false);
    }
  };

  const toggleHint = async (hintIndex: number) => {
    setNowOpenHints((prev) =>
      prev.includes(hintIndex)
        ? prev.filter((index) => index !== hintIndex)
        : [...prev, hintIndex]
    );

    let newEverOpenHints = everOpenHints;
    if (!everOpenHints.includes(hintIndex)) {
      newEverOpenHints = [...everOpenHints, hintIndex];
      setEverOpenHints(newEverOpenHints);
    }

    const baseURL = import.meta.env.PROD
      ? "https://umtp-backend-1.onrender.com"
      : "http://localhost:8000";

    await sendLog({
      baseURL,
      questionId,
      event_name: `open_hint_level_${hintIndex + 1}`,
      answers,
      seenHints: newEverOpenHints,
      hints: hints,
    });
  };

  const handleFeedback = (hintIndex: number, type: "up" | "down") => {
    setFeedback((prev) => ({
      ...prev,
      [hintIndex]: prev[hintIndex] === type ? null : type,
    }));

    const baseURL = import.meta.env.PROD
      ? "https://umtp-backend-1.onrender.com"
      : "http://localhost:8000";

    sendLog({
      baseURL,
      questionId,
      event_name: `feedback_${type}_level_${hintIndex + 1}`,
      answers,
      seenHints: everOpenHints,
      hints,
    });
  };

  const getHintIcon = (level: number) => {
    switch (level) {
      case 0:
        return <Lightbulb className="h-4 w-4" />;
      case 1:
        return <BookOpen className="h-4 w-4" />;
      case 2:
        return <Target className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getHintColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-green-100 text-green-800";
      case 1:
        return "bg-yellow-100 text-yellow-800";
      case 2:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <section className="bg-white shadow rounded-xl p-6 border border-gray-200 h-full overflow-y-auto">
        <div className="mb-3">
          <Button onClick={createHint} disabled={loading}>
            ヒントを要求する
            {loading && <Loader2Icon className="animate-spin" />}
          </Button>
        </div>

        {isAnswerProgressCorrect === false && (
          <div className="mb-3">
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>あなたの現在の回答は間違えがあります。</AlertTitle>
              <AlertDescription>
                問題をよく読み、自信のある部分まで回答し、再度ヒントを要求してください。
              </AlertDescription>
            </Alert>
          </div>
        )}

        <Card className="w-full relative">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              LLMによるヒント
            </CardTitle>
            <CardDescription>
              必要に応じてヒントを確認してください。ヒントはレベルが上がるにつれ，段階的に詳しくなります。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 w-sm">
            {hints.length === 0 ? (
              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                <p className="text-gray-600">
                  まだヒントは生成されていません。
                  <br />
                  「ヒントを要求する」ボタンを押してください。
                </p>
              </div>
            ) : (
              hints.map((hint, index) => (
                <div key={index}>
                  <Collapsible
                    open={nowOpenHints.includes(index)}
                    onOpenChange={() => toggleHint(index)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-4 h-auto text-left hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <div className="flex items-center gap-3">
                          {getHintIcon(index)}
                          <span className="font-medium">
                            レベル {index + 1}
                          </span>
                          <Badge className={getHintColor(index)}>
                            {index === 0
                              ? "方向付け"
                              : index === 1
                              ? "部分解答"
                              : "手順ガイド"}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`ml-2 ${
                              everOpenHints.includes(index)
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {everOpenHints.includes(index)
                              ? "開封済み"
                              : "未開封"}
                          </Badge>
                        </div>
                        {nowOpenHints.includes(index) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4">
                      <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {hint}
                        </p>
                      </div>
                      <div className="flex gap-2 p-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button onClick={() => handleFeedback(index, "up")}>
                              {feedback[index] === "up" ? (
                                <HiMiniHandThumbUp size={18} />
                              ) : (
                                <HiOutlineHandThumbUp size={18} />
                              )}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p>良いヒントです</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleFeedback(index, "down")}
                            >
                              {feedback[index] === "down" ? (
                                <HiMiniHandThumbDown size={18} />
                              ) : (
                                <HiOutlineHandThumbDown size={18} />
                              )}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p>良くないヒントです</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  {index < hints.length - 1 && <Separator className="mt-4" />}
                </div>
              ))
            )}
          </CardContent>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl">
              <Loader2Icon className="animate-spin h-8 w-8 text-gray-500" />
            </div>
          )}
        </Card>
      </section>
    </>
  );
}

export default Hintarea;
