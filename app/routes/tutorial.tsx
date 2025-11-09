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
    selector: ".all-page",
    content: (
      <div>
        これからチュートリアルを始めます。
        <br />
        ここでは、問題回答画面の操作手順を説明するので、
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
        もし、問題を解いている中で，どのように考えれば良いのか分からない場面に遭遇し停滞してしまった場合、次に進むためのヒントを要求することができます。
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
        <br />
        ここでは、ヒントが生成されませんでした。チュートリアルを次に進めましょう。
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
        ヒントの生成に1,2分ほど時間がかかる場合があります。
        そのため、もう一度問題を見直しながらお待ちください。）
      </div>
    ),
  },
  {
    selector: ".hint-area",
    content: (
      <div>
        現在の回答に誤りがなければ、
        <br />
        ヒントが生成されたはずです。
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
    content: (
      <div>
        3段階のヒントの内容を説明します。
        <br />
        レベル1が問題のどこに注目するべきか。
        <br />
        レベル2が問題を解くために必要なUMLの知識。
        <br />
        レベル3では、UMLを知識をどのように適用するかを提示します。
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
        レベル1では問題記述のどこに注目するべきかが提示されます。もう一度回答を考えてみましょう。
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
        より詳しい情報を参考にすることができます。
      </div>
    ),
  },
  {
    selector: ".hint-area",
    content: (
      <div>
        ヒントを閲覧したら、次の行動にうつる前にヒントの評価をお願いします。
        <br />
        ヒントが役に立ったかを5段階で評価し、その理由を記入してもらいます。
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
        ヒントを5段階で評価し、その理由を記入した後、送信ボタンを押してみましょう。
        <br />
        画面右下に「評価を送信しました！」と表示されれば、送信完了です。
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
        レベル1のヒントでは分からなかったとして、レベル2のヒントもクリックし、開いてみましょう。
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
    selector: ".submit-answer-button",
    content: (
      <div>
        回答が完成したら、
        <br />
        「回答を送信」ボタンを押して回答を提出します。
      </div>
    ),
  },
  {
    selector: ".all-page",
    stepInteraction: true,
    spotlightClicks: true,
    content: (
      <div>
        <strong style={{ color: "green" }}>[実際に操作]</strong>
        <br />
        ボタン「回答を送信」を押し、その中のボタン「送信」まで押してみましょう。
        <br />
        画面右下に「回答を送信しました！」と表示されれば、送信完了です。
      </div>
    ),
  },
  {
    selector: ".all-page",
    content: (
      <div>
        チュートリアルは以上です。
        <br />
        実際の問題に挑戦してみましょう！
      </div>
    ),
  },
];
