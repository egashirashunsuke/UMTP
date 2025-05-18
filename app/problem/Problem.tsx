import Choices from "~/components/Choices";
import classdiagram from "./classdiagram.svg"
export function Problem() {
  return (
    <>
   <section className="mt-8 bg-white dark:bg-gray-900 shadow rounded-xl p-6 space-y-4 border border-gray-200 dark:border-gray-700 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
        市営駐輪場の利用申し込みシステム
      </h1>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        この市には第1と第2の駐輪場があります。それぞれの駐輪場で、月額料金は異なります。市営駐輪場の利用を申し込むには、事前に会員登録する必要があります。会員登録では、氏名、住所、電話番号、メールアドレスを登録します。会員登録をすると、登録番号とパスワードがメールで送付されます。駐輪場の申し込み画面を開き、登録番号とパスワードを入力し、ログインしたあとに、希望の駐輪場を選択し利用申請をします。希望者が多数の場合は、抽選が行われます。抽選が外れると、次回の抽選で当選しやすくなります。
      </p>
    </section>
    <section className="bg-white dark:bg-gray-900 shadow rounded-xl p-6 space-y-4 border border-gray-200 dark:border-gray-700 max-w-xl mx-auto">
    <Choices />
    </section>
    <section className="bg-white dark:bg-gray-900 shadow rounded-xl p-6 space-y-4 border border-gray-200 dark:border-gray-700 max-w-xl mx-auto">
    <img
        src={classdiagram}
        className="w-full max-w-sm"
        />
    </section>
    
    </>
  );
}
