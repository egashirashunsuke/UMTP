import axios from "axios";
import { TourProvider } from "@reactour/tour";
import TutorialPageContent from "~/components/TutorialPageContent";
import type { Route } from "./+types/tutorial";

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
export type LoaderData = {
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
  const id = 1;

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

export default function TutorialPage({ loaderData }: Route.ComponentProps) {
  return (
    <TourProvider steps={steps} disableInteraction={true}>
      <TutorialPageContent loaderData={loaderData} />
    </TourProvider>
  );
}

const steps = [
  {
    selector: ".question-area",
    content: (
      <div>
        これからチュートリアルを始めます。
        <br />
        操作手順を説明するので、
        <br />
        <strong>[実際に操作]</strong>と書かれた部分は
        <strong style={{ color: "green" }}> 実際に操作 </strong>
        をして進めてください。
      </div>
    ),
  },
  {
    selector: ".question-area",
    content: (
      <div>
        まずは、問題文を読み、
        <br />
        自分の力で回答することを目指してもらいます。
      </div>
    ),
  },
  {
    selector: ".question-area",
    stepInteraction: true,
    spotlightClicks: true,
    content: (
      <div>
        <strong style={{ color: "green" }}>[実際に操作]</strong>
        <br />
        試しに、解答欄のaを押して、
        <br />
        <strong>A. 駐輪場</strong>を選択してみましょう。
      </div>
    ),
  },
  {
    selector: ".hint-area",
    content: (
      <div>
        もし、問題を解いている中で，どのように考えれば良いのか分からない場面に遭遇した場合、ヒントを要求することができます。
      </div>
    ),
  },
  {
    selector: ".hint-area",
    stepInteraction: true,
    spotlightClicks: true,
    content: (
      <div>
        <strong style={{ color: "green" }}>[実際に操作]</strong>
        <br />
        ボタン「ヒントを要求する」を押してみましょう。
      </div>
    ),
  },
  {
    selector: ".hint-area",
    content: (
      <div>
        この場面では、ヒントが出ず、赤い文字が表示されました。
        <br />
        現在の回答に間違いがあると、
        <br />
        ヒントは生成されません。
        <br />
        回答を見直す必要があります。
      </div>
    ),
  },
  {
    selector: ".question-area",
    stepInteraction: true,
    spotlightClicks: true,
    content: (
      <div>
        <strong style={{ color: "green" }}>[実際に操作]</strong>
        <br />
        ここでは、一度、解答欄aを未選択に戻してみましょう。これで、現在の回答に誤りがなくなりました。
      </div>
    ),
  },
  {
    selector: ".hint-area",
    stepInteraction: true,
    spotlightClicks: true,
    content: (
      <div>
        <strong style={{ color: "green" }}>[実際に操作]</strong>
        <br />
        再度ボタン「ヒントを要求する」を押してください。
        <br />
        （生成に少し時間がかかる場合があります。1分ほど）
      </div>
    ),
  },
  {
    selector: ".hint-area",
    content: (
      <div>
        現在の回答に誤りがなければ、
        <br />
        このようにヒントが生成されます。
      </div>
    ),
  },
  {
    selector: ".hint-area",
    content: (
      <div>
        3段階のヒントが提示されました。
        <br />
        レベルが上がるほど、より詳しいヒントになります。
        <br />
        <strong>レベル1 → レベル2 → レベル3</strong>の順に確認してもらいます。
      </div>
    ),
  },
  {
    selector: ".hint-area",
    stepInteraction: true,
    spotlightClicks: true,
    content: (
      <div>
        <strong style={{ color: "green" }}>[実際に操作]</strong>
        <br />
        まずはレベル1のヒントをクリックし、開いてみましょう。
      </div>
    ),
  },
  {
    selector: ".hint-area",
    content: (
      <div>
        ヒントの中身が表示されました。
        <br />
        レベル1のヒントをもとに、 もう一度回答を考えてみましょう。
      </div>
    ),
  },
  {
    selector: ".hint-area",
    content: (
      <div>
        それでも難しい場合は、
        <br />
        レベル2、レベル3のヒントへ進み、
        <br />
        より詳しい情報を参考にしましょう。
      </div>
    ),
  },
  {
    selector: ".hint-area",
    stepInteraction: true,
    spotlightClicks: true,
    content: (
      <div>
        <strong style={{ color: "green" }}>[実際に操作]</strong>
        <br />
        レベル2のヒントもクリックし、開いてみましょう。
      </div>
    ),
  },
  {
    selector: ".hint-area",
    content: (
      <div>
        このように、
        <br />
        必要に応じてヒントを活用しながら、
        <br />
        自分の力で答えに近づいていきましょう。
      </div>
    ),
  },
  {
    selector: ".hint-area",
    content: (
      <div>
        回答が完成したら、
        <br />
        「回答を送信」ボタンを押してください。
        <br />
        お疲れさまでした！
      </div>
    ),
  },
  {
    selector: ".hint-area",
    content: (
      <div>
        チュートリアルは以上です。
        <br />
        実際の問題に挑戦してみましょう！
      </div>
    ),
  },
];
