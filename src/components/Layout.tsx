import React from 'react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div 
      className={cn(
        'min-h-screen w-full bg-gradient-to-br from-secondary/30 via-background to-primary/10',
        'flex flex-col items-center p-4 md:p-8',
        'overflow-hidden',
        className
      )}
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <header className="w-full mb-8 flex flex-col md:flex-row items-center justify-between animate-fade-in">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-3xl md:text-5xl font-bold text-primary mb-2">
              Тоғыз Құмалақ
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto md:mx-0">
              Орталық Азияда кең таралған, ежелгі стратегия және есептеу ойыны.
            </p>
          </div>
          {/* Навигация */}
          <nav className="flex gap-4 mt-4 md:mt-0">
            {/* <a href="/" className="text-primary font-semibold hover:underline">Басты бет</a> */}
            <a href="/history" className="text-primary font-semibold hover:underline">Тарих</a>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('sessionId');
                window.location.href = '/auth';
              }}
              className="text-red-600 font-semibold hover:underline"
            >
              Шығу
            </button>
          </nav>
        </header>
        
        {/* Main content */}
        <main className="w-full">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="w-full mt-12 text-center text-sm text-muted-foreground">
          <p>© 2025 Togyz Qumalaq with AI</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
