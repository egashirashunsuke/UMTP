import React, { useEffect, useState } from "react";
import axios from "axios";
import type { Answers } from "~/routes/home";
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
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import { Loader2Icon } from "lucide-react";

type HintareaProps = {
  answers?: Answers;
  questionId?: number;
  isReset?: boolean;
};

type HintResponse = {
  hints: string[];
};

function Hintarea({ answers, questionId, isReset }: HintareaProps) {
  const [hints, setHints] = useState<string[]>(["まだヒントはありません。"]);
  const [loading, setLoading] = useState(false);

  const [openHints, setOpenHints] = useState<number[]>([]);
  const [seenHints, setSeenHints] = useState<number[]>([]);

  useEffect(() => {
    const saved = sessionStorage.getItem(`seenHints-${questionId}`);
    if (saved) {
      setSeenHints(JSON.parse(saved));
    }
  }, [questionId]);

  useEffect(() => {
    sessionStorage.setItem(
      `seenHints-${questionId}`,
      JSON.stringify(seenHints)
    );
  }, [seenHints, questionId]);

  useEffect(() => {
    if (isReset && questionId != null) {
      setSeenHints([]);
      sessionStorage.removeItem(`seenHints-${questionId}`);
    }
  }, [isReset, questionId]);

  const createHint = async () => {
    setLoading(true);
    try {
      const baseURL = import.meta.env.PROD
        ? "https://umtp-backend-1.onrender.com"
        : "http://localhost:8000";
      const res = await axios.post<HintResponse>(
        `${baseURL}/question/${questionId}/hints`,
        {
          answers,
        }
      );
      setHints(res.data.hints);
    } catch (e) {
      console.error("通信失敗", e);
      setHints(["通信失敗"]);
    } finally {
      setLoading(false);
    }
  };

  const toggleHint = (hintIndex: number) => {
    setOpenHints((prev) =>
      prev.includes(hintIndex)
        ? prev.filter((index) => index !== hintIndex)
        : [...prev, hintIndex]
    );

    if (!seenHints.includes(hintIndex)) {
      setSeenHints((prev) => [...prev, hintIndex]);
    }
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
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case 1:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case 2:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
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
          <CardContent className="space-y-4">
            {hints.map((hint, index) => (
              <div key={index}>
                <Collapsible
                  open={openHints.includes(index)}
                  onOpenChange={() => toggleHint(index)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-4 h-auto text-left hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        {getHintIcon(index)}
                        <span className="font-medium">レベル {index + 1}</span>
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
                            seenHints.includes(index)
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {seenHints.includes(index) ? "開封済み" : "未開封"}
                        </Badge>
                      </div>
                      {openHints.includes(index) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 pb-4">
                    <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {hint}
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                {index < hints.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
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
