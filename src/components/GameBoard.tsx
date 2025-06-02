import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import Hole from './Hole';
import Kazan from './Kazan';
import { GameState, initialGameState, makeMove, isValidMove, getValidMoves } from '@/utils/gameLogic';
// import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Bot, RefreshCw, Info, Star } from 'lucide-react';
import aiService from '@/services/aiService';

interface GameBoardProps {
  className?: string;
}

const GameBoard: React.FC<GameBoardProps> = ({ className }) => {
  // const { isSignedIn } = useUser();
  const isSignedIn = true; // Temporary override
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [showValidMoves, setShowValidMoves] = useState(false);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [playingAgainstAI, setPlayingAgainstAI] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [lastAIMove, setLastAIMove] = useState<[number, number] | null>(null);
  
  // Мобилді құрылғыны анықтау
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Егер мобилді құрылғы болса, тек хабарлама көрсетеміз
  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-xl font-bold mb-2">Мобилді құрылғыларда қолжетімді емес</div>
        <div className="text-base font-semibold">Ойынды тек компьютерден ашыңыз</div>
      </div>
    );
  }
  
  // Ойын күйін localStorage-тан жүктеу (бірінші рендерде)
  useEffect(() => {
    const saved = localStorage.getItem('gameState');
    if (saved) setGameState(JSON.parse(saved));
  }, []);

  // Ойын күйін localStorage-қа сақтау
  const saveGameState = (newState: GameState) => {
    localStorage.setItem('gameState', JSON.stringify(newState));
  };
  
  // Calculate valid moves when the game state changes
  useEffect(() => {
    const calculatedValidMoves = getValidMoves(gameState);
    setValidMoves(calculatedValidMoves);

    // Ойын күйін әр өзгерген сайын localStorage-қа сақтау
    saveGameState(gameState);

    // Auto AI moves
    const handleAIMove = async () => {
      if (playingAgainstAI && gameState.currentPlayer === 2 && !gameState.gameOver) {
        setIsAIThinking(true);
        // Имитация: 2-3 секундтық кідіріс (рандом)
        const thinkTime = 2000 + Math.random() * 1000; // 2-3 секунд
        await new Promise(resolve => setTimeout(resolve, thinkTime));
        const aiMove = await aiService.getAIMove(gameState);
        if (aiMove) {
          setLastAIMove(aiMove);
          const [row, col] = aiMove;
          const newState = makeMove(gameState, row, col);
          setGameState(newState);
        }
        setIsAIThinking(false);
      }
    };
    
    handleAIMove();
  }, [gameState, playingAgainstAI]);
  
  // Handle clicking on a hole
  const handleHoleClick = (playerRow: number, holeIndex: number) => {
    if (playingAgainstAI && gameState.currentPlayer === 2) {
      // Don't allow clicking during AI's turn
      return;
    }
    
    if (isValidMove(gameState, playerRow, holeIndex)) {
      setLastAIMove(null);
      const newState = makeMove(gameState, playerRow, holeIndex);
      setGameState(newState);
    }
  };
  
  // Reset the game
  const resetGame = useCallback(() => {
    setGameState(initialGameState);
    setShowValidMoves(false);
    localStorage.removeItem('gameState');
  }, []);
  
  // Toggle AI opponent
  const toggleAI = useCallback(() => {
    setPlayingAgainstAI(!playingAgainstAI);
    resetGame();
  }, [playingAgainstAI, resetGame]);
  
  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      {/* Game information */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold text-primary mb-2">
            {gameState.gameOver 
              ? `Ойын аяқталды! ${gameState.winner 
                  ? `${gameState.winner === 1 ? '1-Ойыншы' : (playingAgainstAI ? 'AI' : '2-Ойыншы')} жеңді!` 
                  : 'Тең ойын!'}` 
              : `${gameState.currentPlayer === 1 ? '1-Ойыншы' : (playingAgainstAI ? 'AI' : '2-Ойыншы')} кезегі`}
          </h2>
          
          {isAIThinking && (
            <div className="text-muted-foreground flex items-center gap-2 animate-pulse">
              <Bot size={16} />
              <span>AI ойлап жатыр...</span>
              <span className="ml-2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
            </div>
          )}
          
          {gameState.tuzdik && (
            <div className="text-accent flex items-center gap-2 mt-1">
              <Star size={16} className="text-amber-500" /> 
              {gameState.tuzdik[0] === 1 ? '1-Ойыншы' : (playingAgainstAI ? 'AI' : '2-Ойыншы')} құрған тұздық: {gameState.tuzdik[1] + 1} позиция
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap justify-center sm:justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowValidMoves(!showValidMoves)}
            disabled={gameState.gameOver}
            className="flex items-center gap-1"
          >
            <Info size={16} />
            {showValidMoves ? 'Жүрістерді жасыру' : 'Жүрістерді көрсету'}
          </Button>
          
          <Button
            variant={playingAgainstAI ? "default" : "secondary"}
            size="sm"
            onClick={toggleAI}
            className="flex items-center gap-1"
          >
            <Bot size={16} />
            {playingAgainstAI ? 'Екі адамдық ойын' : 'AI-мен ойнау'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={resetGame}
            className="flex items-center gap-1"
          >
            <RefreshCw size={16} />
            Қайта бастау
          </Button>
        </div>
      </div>
      
      {/* Game board */}
      <div className="bg-togyz-board rounded-2xl p-4 flex flex-col items-center shadow-lg">
        {/* Жоғарғы қатар (AI) */}
        <div className="flex flex-row gap-1 sm:gap-2 md:gap-4 justify-center mb-2">
          {gameState.board[1].map((count, idx) => (
            <Hole
              key={`p2-${idx}`}
              count={count}
              playerSide={2}
              isSelectable={playingAgainstAI ? false : isValidMove(gameState, 1, idx)}
              isHighlighted={showValidMoves && isValidMove(gameState, 1, idx)}
              isTuzdik={gameState.tuzdik && gameState.tuzdik[0] !== 2 && gameState.tuzdik[1] === idx}
              onClick={() => handleHoleClick(1, idx)}
              position={idx}
              isAIMove={lastAIMove && lastAIMove[0] === 1 && lastAIMove[1] === idx}
              isDirectionIndicator={gameState.currentPlayer === 2 && isValidMove(gameState, 1, idx) && showValidMoves}
            />
          ))}
        </div>
        {/* 1-ойыншының қазаны (ұзын жолақ) */}
        <div className="w-full flex flex-col items-center mb-2">
          <div className="w-full max-w-2xl flex justify-center">
            <Kazan 
              score={gameState.kazan[0]} 
              player={1} 
              isCurrentPlayer={gameState.currentPlayer === 1}
              isAIMode={false}
              labelColor="text-white drop-shadow-md"
              className="w-full h-12 rounded-full"
            />
          </div>
        </div>
        {/* 2-ойыншының қазаны (ұзын жолақ) */}
        <div className="w-full flex flex-col items-center mb-4">
          <div className="w-full max-w-2xl flex justify-center">
            <Kazan 
              score={gameState.kazan[1]} 
              player={2} 
              isCurrentPlayer={gameState.currentPlayer === 2}
              isAIMode={playingAgainstAI}
              labelColor="text-white drop-shadow-md"
              className="w-full h-12 rounded-full"
            />
          </div>
        </div>
        {/* Төменгі қатар (1-ойыншы) */}
        <div className="flex flex-row gap-1 sm:gap-2 md:gap-4 justify-center">
          {gameState.board[0].map((count, idx) => (
            <Hole
              key={`p1-${idx}`}
              count={count}
              playerSide={1}
              isSelectable={isValidMove(gameState, 0, idx)}
              isHighlighted={showValidMoves && isValidMove(gameState, 0, idx)}
              isTuzdik={gameState.tuzdik && gameState.tuzdik[0] !== 1 && gameState.tuzdik[1] === idx}
              onClick={() => handleHoleClick(0, idx)}
              position={idx}
              isAIMove={lastAIMove && lastAIMove[0] === 0 && lastAIMove[1] === idx}
              isDirectionIndicator={gameState.currentPlayer === 1 && isValidMove(gameState, 0, idx) && showValidMoves}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
