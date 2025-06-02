import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:4000';

const History = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/sessions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setSessions(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Жүктелуде...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Ойын тарихы</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Басталған уақыты</th>
            <th className="p-2">Аяқталған уақыты</th>
            <th className="p-2">Есеп</th>
            <th className="p-2">Жеңімпаз</th>
            <th className="p-2">Жалғастыру</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s: any) => (
            <tr key={s.id} className="text-center border-t">
              <td className="p-2">{new Date(s.createdAt).toLocaleString()}</td>
              <td className="p-2">{s.finishedAt ? new Date(s.finishedAt).toLocaleString() : 'Аяқталмаған'}</td>
              <td className="p-2">{s.gameState ? `${s.gameState.kazan[0]} : ${s.gameState.kazan[1]}` : '-'}</td>
              <td className="p-2">{s.winner === 1 ? 'Сіз' : s.winner === 2 ? 'AI' : s.winner === null ? '-' : 'Тең'}</td>
              <td className="p-2">
                {!s.finishedAt && (
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    onClick={() => {
                      localStorage.setItem('sessionId', s.id);
                      window.location.href = '/';
                    }}
                  >
                    Жалғастыру
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History; 