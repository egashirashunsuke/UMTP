import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { getAnonId } from "../lib/anon";

import type { Answers } from "~/routes/home";

type GetToken = () => Promise<string>; // 任意

type LogParams = {
  baseURL: string;
  questionId?: number;
  studentId?: string;
  event_name: string;
  answers?: Answers;
  seenHints: number[];
  hints: string[];
  hintIndex?: number;
  useful?: number;
  comment?: string;
  getToken?: GetToken;
  signal?: AbortSignal;
  timeoutMs?: number;
};

const anonId = getAnonId();

export async function sendLog({
  baseURL,
  questionId,
  studentId,
  event_name,
  answers,
  seenHints,
  hints,
  hintIndex,
  useful,
  comment,
  getToken,
  signal,
  timeoutMs = 8000,
}: LogParams) {
  const finalAnonId = getAnonId();

  const hint_open_status = Object.fromEntries(
    hints.map((_, i) => [i + 1, seenHints.includes(i)]) // seenHints が 0始まり想定
  );

  const logData = {
    question_id: questionId,
    student_id: studentId,
    event_name,
    answers,
    hint_open_status,
    hints: Object.fromEntries(hints.map((h, i) => [i + 1, h])),
    hintIndex,
    useful,
    comment,
    anon_id: finalAnonId,
    timestamp: new Date().toISOString(),
  };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Idempotency-Key": uuidv4(),
  };

  if (getToken) {
    try {
      const token = await getToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    } catch (e: any) {
      console.log("token取得に失敗:", e?.error || e);
      // 認証してない/期限切れ等 → そのまま匿名で送る
    }
  }
  console.log(headers.Authorization);

  await axios.post(`${baseURL}/api/log`, logData, {
    headers,
    signal,
    timeout: timeoutMs,
  });
}
