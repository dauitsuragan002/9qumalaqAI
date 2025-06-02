import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import GameBoard from '@/components/GameBoard';
import ChatBot from '@/components/ChatBot';
import { cn } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';
// import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import aiService from '@/services/aiService';

interface IndexProps {
  openaiApiKey?: string;
  setOpenaiApiKey?: (key: string) => void;
}

const API_URL = 'http://localhost:4000';

const Index: React.FC<IndexProps> = ({ openaiApiKey = "", setOpenaiApiKey }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Set API key in the aiService when it changes
  useEffect(() => {
    if (openaiApiKey) {
      // aiService.setApiKey(openaiApiKey); // Егер setApiKey жоқ болса, бұл жолды алып тастауға болады
    }
  }, [openaiApiKey]);
  
  // Handle API key changes from ChatBot
  const handleApiKeyChange = (key: string) => {
    if (setOpenaiApiKey) {
      setOpenaiApiKey(key);
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      window.location.href = '/auth';
      return;
    }
    setLoading(false);
  }, []);

  if (loading) return <div>Жүктелуде...</div>;

  return (
    <Layout>
      <div className="w-full flex flex-col lg:flex-row gap-6">
        {/* Game area - takes full width on mobile, partial on desktop */}
        <div className={cn(
          'flex-1 transition-all duration-500 ease-in-out',
          isChatOpen ? 'lg:w-2/3' : 'w-full'
        )}>
          <GameBoard className="mx-auto max-w-full" />
        </div>
        
        {/* Chat sidebar - hidden on mobile (with toggle), visible on desktop */}
        <div className={cn(
          'fixed bottom-4 right-4 z-10 lg:relative lg:bottom-auto lg:right-auto',
          'transition-all duration-500 ease-in-out',
          isChatOpen ? 'lg:w-1/3 h-[calc(100vh-12rem)]' : 'w-0 opacity-0 invisible'
        )}>
          {isChatOpen && (
            <ChatBot 
              className="w-full h-full max-h-[600px] lg:max-h-none"
              onClose={() => setIsChatOpen(false)}
              openaiApiKey={openaiApiKey}
              onApiKeyChange={handleApiKeyChange}
            />
          )}
        </div>
        
        {/* Mobile toggle for chat */}
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className={cn(
              'fixed bottom-4 right-4 z-10 p-4 rounded-full',
              'bg-primary text-white shadow-lg',
              'flex items-center justify-center',
              'hover:bg-primary/90 transition-all'
            )}
          >
            <MessageCircle size={24} />
          </button>
        )}
      </div>
    </Layout>
  );
};

export default Index;
