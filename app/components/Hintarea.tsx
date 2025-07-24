import React, { useState } from "react";
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

type HintareaProps = {
  answers?: Answers;
  questionId?: number;
};

type HintResponse = {
  hints: string[];
};

function Hintarea({ answers, questionId }: HintareaProps) {
  const [hints, setHints] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  const [openHints, setOpenHints] = useState<number[]>([]);

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
      <section className="bg-white shadow rounded-xl p-6 border border-gray-200 h-220">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3"
          onClick={createHint}
          disabled={loading}
        >
          hintrequest
        </button>

        {loading ? (
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                学習ヒント
              </CardTitle>
              <CardDescription>
                必要に応じてヒントを確認してください。段階的に詳しくなります。
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
          </Card>
        )}
      </section>
    </>
  );
}

export default Hintarea;
