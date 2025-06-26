import Choices from "~/components/Choices";
import classdiagram from "./classdiagram.png"
import AnswerForm from "~/components/AnswerForm";
import type { Answers } from "../routes/home";


type ProblemProps = {
  choices: string[];
  answers: Answers;
  onAnswerChange: (label: string, value: string) => void;
};

export function Problem({ choices, answers, onAnswerChange }: ProblemProps) {
  return (
    <>
    <div className="h-90">
      <section className="m-8 bg-white shadow rounded-xl p-6 space-y-4 border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto">
        <h1 className="text-xl font-semibold text-gray-900 ">
          市営駐輪場の利用申し込みシステム
        </h1>
        <p className="text-gray-700  leading-relaxed">
          この市には第1と第2の駐輪場があります。それぞれの駐輪場で、月額料金は異なります。市営駐輪場の利用を申し込むには、事前に会員登録する必要があります。会員登録では、氏名、住所、電話番号、メールアドレスを登録します。会員登録をすると、登録番号とパスワードがメールで送付されます。駐輪場の申し込み画面を開き、登録番号とパスワードを入力し、ログインしたあとに、希望の駐輪場を選択し利用申請をします。希望者が多数の場合は、抽選が行われます。抽選が外れると、次回の抽選で当選しやすくなります。
        </p>
      </section>
    </div>
    <div className="display flex align-center justify-center m-8">
      <section className="bg-white shadow rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <img
            src={classdiagram}
            className="w-full max-w-sm"
            />
      </section>
      <div>
        <section className="bg-white shadow rounded-xl p-6 border border-gray-200 max-w-sm">
          <Choices choices={choices}/> 
        </section>
        <section className="bg-white shadow rounded-xl p-6 border border-gray-200">
          <AnswerForm 
            choices={choices}
            answers={answers}
            onChange={onAnswerChange}/>
        </section>
      </div>
    </div>
    
    </>
  );
}
