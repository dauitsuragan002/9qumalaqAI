import React from 'react';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-yellow-300">
      <h1 className="text-4xl md:text-6xl font-bold text-yellow-800 mb-4 text-center">Тоғызқұмалақ AI</h1>
      <p className="text-lg md:text-2xl text-yellow-900 mb-8 text-center max-w-2xl">
        Орталық Азияның ежелгі ойыны. Стратегия, логика, есеп — бәрі бір жерде! Жасанды интеллектпен немесе адаммен ойнаңыз.
      </p>
      
      <button
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-8 py-3 rounded-xl text-xl shadow-lg transition"
        onClick={() => window.location.href = '/auth'}
      >
        Ойнау
      </button>
    </div>
  );
};

export default Landing; 