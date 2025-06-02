import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Bot, User, Send, Info, X, BotMessageSquare } from 'lucide-react';
// import { useUser } from '@clerk/clerk-react';
import OpenAI from 'openai';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  className?: string;
  onClose?: () => void;
  openaiApiKey?: string;
  onApiKeyChange?: (key: string) => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ className, onClose, openaiApiKey, onApiKeyChange }) => {
  // const { user, isSignedIn } = useUser();
  const user = { firstName: "Пайдаланушы" };
  const isSignedIn = true;
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Сәлем! Мен сізге Тоғыз Құмалақ ережелерін түсінуге немесе ойын кеңестерін беруге көмектесе аламын. Сізге қалай көмектесе аламын?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState<string>(openaiApiKey || '');
  const [showApiInput, setShowApiInput] = useState(!openaiApiKey);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Update API key when it changes from props
  useEffect(() => {
    if (openaiApiKey) {
      setApiKey(openaiApiKey);
      setShowApiInput(false);
    }
  }, [openaiApiKey]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate bot typing
    setIsTyping(true);
    
    try {
      if (apiKey) {
        // Use OpenAI for response
        const openai = new OpenAI({
          apiKey: apiKey,
          dangerouslyAllowBrowser: true // For client-side usage - not recommended for production!
        });
        
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are an assistant who knows about Togyz Kumalak (a traditional Kazakh board game). You help users learn the rules, understand strategy, and answer questions about the game. Always respond in the same language as the user's message. If they use Kazakh, respond in Kazakh. If they use Russian, respond in Russian. If they use English, respond in English. Be polite, helpful and concise."
            },
            ...messages.filter(m => m.id > 1).map(m => ({
              role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
              content: m.text
            })),
            {
              role: "user",
              content: input
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        });
        
        const botReply = response.choices[0]?.message?.content || "Кешіріңіз, мен жауап бере алмадым. Кейінірек қайталап көріңіз.";
        
        const botMessage: Message = {
          id: messages.length + 2,
          text: botReply,
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Fallback to default responses
        setTimeout(() => {
          const botResponses = [
            "Тоғыз Құмалақ - бұл дәстүрлі тақта ойыны, онда ойыншылар тастарды шұңқырларға таратады. Мақсат - қарсыласыңызға қарағанда көбірек тас жинау.",
            "Әр ойыншы 9 шұңқырмен басталады, әрқайсысында 9 тас бар. Сіз кезекпен өз шұңқырларыңыздың бірінен барлық тастарды алып, оларды сағат тіліне қарсы бағытта таратасыз.",
            "Сіз өз кезегіңізде шұңқырларыңыздың біріне басу арқылы жүре аласыз. Ойын жүрістерді бөлектейді, егер сіз 'Жарамды жүрістерді көрсету' түймесін бассаңыз.",
            "Тастар бір-бірден таратылады. Егер сіздің соңғы тасыңыз белгілі бір позицияларға тиген болса, арнайы ережелер қолданылады.",
            "Ойын бір ойыншы 81 немесе одан да көп тас жинағанда немесе бір ойыншының жүрістері қалмаған кезде аяқталады.",
            "Шахмат сияқты, бірнеше қадам алдын-ала жоспарлау - бұл жеңіске жету кілті. Қарсыласыңыздың жауаптарын болжау.",
            "Мен де Тоғыз Құмалақ туралы үйреніп жатырмын! Бұл ойынның Қазақстан мен Орталық Азияда бай мәдени тарихы бар.",
            "Казанға (ұпай шұңқырына) назар аударыңыз, кім алдыда екенін көру үшін. Казанында көбірек тасы бар ойыншы жеңеді.",
            "Тастарды ұстап қалуға назар аударыңыз, сонымен қатар қарсыласыңыздың осылай істеуіне жол бермеңіз. Стратегиялық шұңқырларды қорғау маңызды."
          ];
          
          const botMessage: Message = {
            id: messages.length + 2,
            text: botResponses[Math.floor(Math.random() * botResponses.length)],
            sender: 'bot',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Error with OpenAI API:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Кешіріңіз, сұрауыңызды өңдеу кезінде қате орын алды. OpenAI API кілтіңіз дұрыс екенін тексеріңіз.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  
  // Handle API key submission
  const handleSetApiKey = () => {
    if (apiKey.trim()) {
      // Here we would validate the API key format
      const isValidApiKey = apiKey.startsWith('sk-') && apiKey.length > 5;
      
      if (isValidApiKey) {
        setShowApiInput(false);
        // Add a confirmation message
        const confirmationMessage: Message = {
          id: messages.length + 1,
          text: "OpenAI API кілті орнатылды. Енді сіз AI-мен сөйлесе аласыз!",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, confirmationMessage]);
        
        // Notify parent component about the API key change
        if (onApiKeyChange) {
          onApiKeyChange(apiKey);
        }
      } else {
        // Add error message for invalid key format
        const errorMessage: Message = {
          id: messages.length + 1,
          text: "Кешіріңіз, API кілтінің форматы жарамсыз. OpenAI API кілті 'sk-' префиксінен басталуы керек.",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    }
  };
  
  // Handle key press for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className={cn(
      'flex flex-col rounded-xl overflow-hidden shadow-xl',
      'bg-white/10 backdrop-blur-md border border-white/20',
      'transition-all duration-500 ease-in-out h-full',
      'animate-slide-in',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 backdrop-blur-md bg-togyz-boardDark/30">
        <div className="flex items-center gap-2">
          <BotMessageSquare className="text-togyz-piece h-5 w-5" />
          <h3 className="text-lg font-semibold text-togyz-piece">Тоғыз Құмалақ Көмекші</h3>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-togyz-piece/70 hover:text-togyz-piece transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-togyz-boardDark/10 to-togyz-boardDark/5">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={cn(
              'mb-4 max-w-[80%] animate-slide-up',
              message.sender === 'user' ? 'ml-auto' : 'mr-auto'
            )}
            style={{ animationDelay: `${(message.id % 10) * 0.1}s` }}
          >
            <div className={cn(
              'p-3 rounded-lg',
              message.sender === 'user' 
                ? 'bg-primary/90 text-white rounded-br-none' 
                : 'bg-secondary/80 text-foreground rounded-bl-none'
            )}>
              <div className="flex items-center gap-2 mb-1">
                {message.sender === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
                <span className="text-xs opacity-70">
                  {message.sender === 'user' ? 'Сіз' : 'Көмеkші'} · {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground ml-2 animate-pulse">
            <Bot className="h-4 w-4" />
            <span>Көмеkші жазып жатыр...</span>
          </div>
        )}
        
        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Info message */}
      <div className="px-4 py-2 bg-muted/50 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Info className="h-3 w-3" />
          <p>{apiKey ? "OpenAI API интеграциясы қосылған." : "OpenAI API интеграциясы жоқ. Жауаптар алдын ала жазылған."}</p>
        </div>
      </div>
      
      {/* Input area */}
      <div className="p-3 border-t border-white/10 backdrop-blur-sm bg-togyz-boardDark/20">
        <div className="flex gap-2">
          <div className="flex-1 bg-white/10 rounded-lg overflow-hidden border border-white/20 backdrop-blur-sm focus-within:ring-1 focus-within:ring-primary/50">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Хабарлама жазыңыз..."
              className="w-full px-3 py-2 bg-transparent outline-none resize-none text-sm max-h-32"
              rows={1}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className={cn(
              'p-2 rounded-lg transition-all duration-300',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
              input.trim() 
                ? 'bg-primary text-white hover:bg-primary/90' 
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
