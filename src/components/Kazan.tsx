import React from 'react';
import { cn } from '@/lib/utils';
import GamePiece from './GamePiece';

interface KazanProps {
  score: number;
  player: 1 | 2;
  isCurrentPlayer: boolean;
  isAIMode?: boolean;
  labelColor?: string;
  className?: string;
}

const Kazan: React.FC<KazanProps> = ({ score, player, isCurrentPlayer, isAIMode = false, labelColor = 'text-togyz-piece', className }) => {
  return (
    <div className={cn(
      'relative flex flex-col items-center',
      'transition-all duration-300 ease-in-out',
      className
    )}>
      <div className={cn(
        'w-full h-10 sm:h-12 md:h-16 rounded-full bg-togyz-boardDark flex flex-row items-center justify-between px-3 sm:px-6',
        'border-4 border-togyz-board/80',
        'shadow-lg transition-all duration-300',
        isCurrentPlayer ? 'ring-2 ring-togyz-highlight' : ''
      )}>
        <span className={cn("text-base sm:text-lg md:text-xl font-bold", labelColor, "drop-shadow-md")}>{player === 1 ? '1-Ойыншы' : (isAIMode ? 'AI' : '2-Ойыншы')}</span>
        <span className="text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-md">{score}</span>
      </div>
      {/* Label */}
      <div className={cn(
        'mt-2 text-sm font-bold',
        'transition-all duration-300',
        isCurrentPlayer ? 'text-primary font-bold' : 'text-white drop-shadow-md'
      )}>
      </div>
    </div>
  );
};

export default Kazan;
