import React from 'react';
import { cn } from '@/lib/utils';
import GamePiece from './GamePiece';
import { Star } from 'lucide-react';

interface HoleProps {
  count: number;
  playerSide: 1 | 2;
  position: number;
  isSelectable?: boolean;
  isHighlighted?: boolean;
  isTuzdik?: boolean;
  onClick?: () => void;
  isAIMove?: boolean;
  isDirectionIndicator?: boolean;
}

const Hole: React.FC<HoleProps> = ({
  count,
  playerSide,
  position,
  isSelectable = false,
  isHighlighted = false,
  isTuzdik = false,
  onClick,
  isAIMove = false,
  isDirectionIndicator = false,
}) => {
  const isTop = playerSide === 2;
  
  return (
    <div 
      className={cn(
        'relative flex flex-col items-center justify-center',
        'transition-all duration-300 ease-in-out',
        isSelectable && 'cursor-pointer',
        isHighlighted && 'animate-pulse'
      )}
    >
      <div
        onClick={isSelectable ? onClick : undefined}
        className={cn(
          'w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full',
          'bg-togyz-boardDark bg-opacity-80',
          'flex items-center justify-center',
          'border-2',
          isTuzdik ? 'border-amber-400' : 'border-togyz-board/60',
          'transition-all duration-300',
          isSelectable && 'hover:scale-105 hover:shadow-md hover:border-togyz-highlight',
          isHighlighted && 'ring-2 ring-togyz-highlight',
          isAIMove && 'ring-4 ring-red-500 animate-pulse'
        )}
      >
        {isTuzdik && (
          <div className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-1 shadow-md">
            <Star size={12} className="text-togyz-boardDark" />
          </div>
        )}
        {isAIMove && (
          <div className="absolute -top-2 -left-2 bg-red-500 rounded-full p-1 shadow-lg animate-bounce">
            <span className="text-xs text-white font-bold">AI</span>
          </div>
        )}
        {isDirectionIndicator && (
          <div className={cn(
            'absolute',
            isTop ? '-bottom-5' : '-top-5',
            'left-1/2 -translate-x-1/2 flex items-center'
          )}>
            {playerSide === 1 ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            )}
          </div>
        )}
        
        {count > 0 ? (
          <GamePiece 
            count={count} 
            isInteractive={isSelectable}
            isSelected={isHighlighted}
            onClick={isSelectable ? onClick : undefined}
          />
        ) : (
          <div className="w-2 h-2 bg-togyz-board rounded-full opacity-30" />
        )}
      </div>
    </div>
  );
};

export default Hole;
