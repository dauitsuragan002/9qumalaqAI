import React, { useState } from 'react';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const ADMIN_LOGIN = import.meta.env.VITE_ADMIN_LOGIN;
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (mode === 'login') {
        // Тек бір админ қолданушысы үшін
        if (email === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('fullName', 'Админ');
          setSuccess('Сәтті кірдіңіз!');
          setTimeout(() => {
            window.location.href = '/game';
          }, 500); // 1 секунд кідіріс
        } else {
          throw new Error('Қате email немесе пароль');
        }
      } else {
        // Тіркелу тек визуалды түрде, ешқандай базаға сақталмайды
        setSuccess('Тіркелу сәтті! Енді кіріңіз.');
        setMode('login');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-300">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center text-yellow-800">
          {mode === 'login' ? 'Кіру' : 'Тіркелу'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <input
              type="text"
              placeholder="Аты-жөніңіз"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          <input
            type="password"
            placeholder="Құпия сөз"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded transition"
          >
            {loading ? 'Күтіңіз...' : (mode === 'login' ? 'Кіру' : 'Тіркелу')}
          </button>
        </form>
        {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
        {success && <div className="text-green-600 mt-2 text-center">{success}</div>}
        <div className="mt-4 text-center">
          {mode === 'login' ? (
            <span>
              Аккаунтыңыз жоқ па?{' '}
              <button className="text-yellow-700 underline" onClick={() => setMode('register')}>Тіркелу</button>
            </span>
          ) : (
            <span>
              Аккаунтыңыз бар ма?{' '}
              <button className="text-yellow-700 underline" onClick={() => setMode('login')}>Кіру</button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth; 