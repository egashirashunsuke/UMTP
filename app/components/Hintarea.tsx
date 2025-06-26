import React, { useState } from 'react'
import axios from 'axios'
import type { Answers } from '~/routes/home';

type HintareaProps = {
  answers?: Answers;
};

function Hintarea({ answers }: HintareaProps) {
  const [hint,setHint] = useState('hintがここに表示されます');

  const createHint = async() => {
    console.log("click");
    console.log(answers);
    try {
      const baseURL = import.meta.env.PROD
      ? 'https://umtp-backend-1.onrender.com'
      : 'http://localhost:8000';
      const res = await axios.post(`${baseURL}/`, { answers });
      setHint(res.data.answer ?? res.data);
    } catch (e) {
      console.error("通信失敗", e);
    }
  }

  return (
    <>
    <section className="bg-white shadow rounded-xl p-6 border border-gray-200 h-220" >
      <button onClick={createHint}>hintrequestボタン</button>
      <h3 style={{ whiteSpace: 'pre-line'}}>
        {typeof hint === "string" ? hint : JSON.stringify(hint)}
      </h3>
    </section>
    </>
  )
}

export default Hintarea;