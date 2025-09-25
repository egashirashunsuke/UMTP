// utils/logging.ts
import axios from "axios";
import type { Answers } from "~/routes/home";

type LogParams = {
  baseURL: string;
  questionId: number | undefined;
  event_name: string;
  answers: Answers | undefined;
  seenHints: number[];
  openHints: number[];
  hints: string[];
};

export async function sendLog({
  baseURL,
  questionId,
  event_name,
  answers,
  seenHints,
  openHints,
  hints,
}: LogParams) {
  const deviceId =
    localStorage.getItem("device_id") || "123e4567-e89b-12d3-a456-426614174000";

  const logData = {
    device_id: deviceId,
    question_id: questionId,
    event_name: event_name,
    answers: answers,
    hint_open_status: Object.fromEntries(
      seenHints.map((i) => [i + 1, openHints.includes(i)])
    ),
    hints: Object.fromEntries(hints.map((h, i) => [i + 1, h])),
    timestamp: new Date().toISOString(),
  };

  try {
    await axios.post(`${baseURL}/api/log`, logData);
  } catch (err) {
    console.error("ログ送信に失敗しました", err);
  }
}
