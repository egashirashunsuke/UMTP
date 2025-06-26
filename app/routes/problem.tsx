import React, { useState } from 'react';
import axios from 'axios';

export default function ProblemSetting() {
  const [question, setQuestion] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [choices, setChoices] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleChoiceChange = (idx: number, value: string) => {
    setChoices(prev => prev.map((c, i) => (i === idx ? value : c)));
  };

  const addChoice = () => setChoices(prev => [...prev, '']);
  const removeChoice = (idx: number) => setChoices(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    try {
      const formData = new FormData();
      formData.append('question', question);
      if (image) formData.append('image', image);
      choices.forEach((choice, idx) => formData.append(`choices[${idx}]`, choice));
      const baseURL = import.meta.env.PROD
        ? 'https://umtp-backend-1.onrender.com'
        : 'http://localhost:8000';
      const res = await axios.post(`${baseURL}/set-problem`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult('送信成功: ' + JSON.stringify(res.data));
    } catch (e: any) {
      setResult('送信失敗: ' + (e?.message || ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">問題設定フォーム</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-1">問題文</label>
          <textarea
            className="w-full border rounded p-2"
            rows={4}
            value={question}
            onChange={e => setQuestion(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">画像</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {image && <div className="mt-2 text-sm">選択中: {image.name}</div>}
        </div>
        <div>
          <label className="block font-semibold mb-1">選択肢リスト</label>
          {choices.map((choice, idx) => (
            <div key={idx} className="flex items-center mb-2">
              <input
                className="border rounded p-1 flex-1"
                type="text"
                value={choice}
                onChange={e => handleChoiceChange(idx, e.target.value)}
                required
              />
              <button type="button" className="ml-2 text-red-500" onClick={() => removeChoice(idx)} disabled={choices.length === 1}>削除</button>
            </div>
          ))}
          <button type="button" className="mt-2 px-2 py-1 bg-blue-200 rounded" onClick={addChoice}>選択肢を追加</button>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? <div role="status">
                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span className="sr-only">Loading...</span>
                     </div> : '送信'}
        </button>
      </form>
      {result && <div className="mt-4 text-sm">{result}</div>}
    </div>
  );
}
