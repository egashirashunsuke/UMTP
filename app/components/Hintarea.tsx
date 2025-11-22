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

import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";

import { Loader2Icon } from "lucide-react";
import { sendLog } from "~/utils/logging";
import { LikertSlider } from "./LikertSlider";

import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "sonner";

export type Answers = { [key: string]: string };

type HintareaProps = {
  answers?: Answers;
  questionId?: number;
  solution?: string;

};


function Hintarea({
  answers,
  questionId,
  solution
}: HintareaProps) {
  const [isAnswerProgressCorrect, setIsAnswerProgressCorrect] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formattedAnswer, setFormattedAnswer] = useState<string>("");
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasFetched, setHasFetched] = useState(false); // 一度取得したかどうかを管理

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const toggleSolution = async () => {
    const baseURL = import.meta.env.PROD
    ? "https://umtp-backend-1.onrender.com"
    : "http://localhost:8000";


    if (isRevealed) {
      setIsRevealed(false);

      await sendLog({
        baseURL,
        questionId,
        studentId: isAuthenticated
          ? user?.email?.split("@")[0]?.slice(0, 8)
          : undefined,
        event_name: "solution_closed",
        answers,
        getToken: isAuthenticated ? () => getAccessTokenSilently() : undefined,
      });
      return;
    }

    if (hasFetched) {
      setIsRevealed(true);
      await sendLog({
        baseURL,
        questionId,
        studentId: isAuthenticated
          ? user?.email?.split("@")[0]?.slice(0, 8)
          : undefined,
        event_name: "solution_opened",
        answers,
        getToken: isAuthenticated ? () => getAccessTokenSilently() : undefined,
      });
      return;
    }

    // 初回取得時のみAPIを呼び出す
    if (!questionId) {
      return;
    }

    setLoading(true);
    try {
      const answerRes = await axios.get<{ answers: { [key: string]: string } }>(
        `${baseURL}/question/${questionId}/answer`
      );

      const answerMap = answerRes.data.answers || {};
      
      // 「a = G」形式の文字列配列に変換して、改行で結合
      const formatted = Object.entries(answerMap)
        .sort(([a], [b]) => a.localeCompare(b)) // アルファベット順にソート
        .map(([key, value]) => `${key} = ${value}`)
        .join('\n'); // 改行で結合して1つの文字列に
      
      setFormattedAnswer(formatted);
      setHasFetched(true);
      setIsRevealed(true);

      // ログ送信（配列形式も保持）
      const formattedArray = Object.entries(answerMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key} = ${value}`); 

        setFormattedAnswer(formatted);
        setHasFetched(true);
        setIsRevealed(true);
  
        // 初回取得時のログ送信（開いた時）
        await sendLog({
          baseURL,
          questionId,
          studentId: isAuthenticated
            ? user?.email?.split("@")[0]?.slice(0, 8)
            : undefined,
          event_name: "solution_opened",
          answers,
          getToken: isAuthenticated ? () => getAccessTokenSilently() : undefined,
        });
    } catch (e) {
      console.error("解答の取得に失敗しました", e);
      if (axios.isAxiosError(e) && e.response?.status === 404) {
        setFormattedAnswer("解答が見つかりませんでした。");
      } else {
        setFormattedAnswer("エラーが発生しました。もう一度お試しください。");
      }
      setHasFetched(true);
      setIsRevealed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="bg-white shadow rounded-xl p-6 border border-gray-200 h-full overflow-y-auto">
        <div className="mb-3">
          <Button onClick={toggleSolution} disabled={loading}>
            {isRevealed ? "解答を閉じる" : "解答を参照する"}
            {loading && <Loader2Icon className="animate-spin" />}
          </Button>
        </div>

        <Card className="w-full relative">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              解答
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 w-md">
            {!isRevealed ? (
              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                <p className="text-gray-600">
                  まだ解答は表示されていません。
                  <br />
                  「解答を参照する」ボタンを押してください。
                </p>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-700 dark:text-gray-300 font-mono text-lg leading-relaxed whitespace-pre-line">
                  {formattedAnswer}
                </p>
              </div>
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
