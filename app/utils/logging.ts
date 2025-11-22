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
  hintIndex?: number;
  getToken?: GetToken;
  signal?: AbortSignal;
  timeoutMs?: number;
};


export async function sendLog({
  baseURL,
  questionId,
  studentId,
  event_name,
  answers,
  hintIndex,
  getToken,
  signal,
  timeoutMs = 8000,
}: LogParams) {
  const finalAnonId = getAnonId();


  const logData = {
    question_id: questionId,
    student_id: studentId,
    event_name,
    answers,
    hintIndex,
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
