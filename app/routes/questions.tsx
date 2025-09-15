import axios from "axios";
import type { Route } from "./+types/questions";
import { Link } from "react-router";

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

// loader の戻り値を QuestionData 型として定義
export async function loader({
  params,
}: Route.LoaderArgs): Promise<QuestionData[]> {
  const baseURL = import.meta.env.PROD
    ? "https://umtp-backend-1.onrender.com"
    : "http://localhost:8000";
  const res = await axios.get<QuestionData[]>(`${baseURL}/questions`);
  return res.data;
}

export default function QuestionPage({ loaderData }: Route.ComponentProps) {
  if (!loaderData) {
    throw new Response("Not Found", { status: 404 });
  }
  console.log("loaderData", loaderData);

  return (
    <div className="flex w-full min-h-screen mt-8">
      <div className="w-7xl">
        <ul className="space-y-4">
          {loaderData.map((q) => (
            <li key={q.id} className="border rounded p-4 hover:bg-gray-50">
              <Link
                to={`/question/${q.id}`}
                className="text-blue-600 hover:underline text-lg font-semibold"
              >
                <p className="text-gray-600 mt-1 text-sm">
                  {q.problem_description.trim().slice(0, 100)}...
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
