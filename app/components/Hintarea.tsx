import React, { useState } from 'react'
import axios from 'axios'

function Hintarea() {
  const [hint,setHint] = useState('a');

  const createHint = async() => {
    console.log("click");
    try {
      const res = await axios.get('http://localhost:8000/');
      setHint(res.data)
    } catch (e) {
      console.error("通信失敗", e);
    }
  }

  return (
    <>
    <section className="mt-8 bg-white dark:bg-gray-900 shadow rounded-xl p-6 space-y-4 border border-gray-200 dark:border-gray-700 h-full" >
      Hintarea
      <button onClick={createHint}>ボタン</button>
      <h3>
        {hint}
      </h3>
    </section>
    </>
  )
}

export default Hintarea;