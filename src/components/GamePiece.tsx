
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface GamePieceProps {
  count: number;
  isInteractive?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const GamePiece: React.FC<GamePieceProps> = ({
  count,
  isInteractive = false,
  isSelected = false,
  onClick,
  size = 'md',
  className
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Generate pieces based on count - limit visual display to avoid clutter
  const piecesToShow = Math.min(count, 9);
  const remainingCount = count > 9 ? count - 9 : 0;
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  return (
    <div 
      className={cn(
        'relative flex items-center justify-center rounded-full transition-all duration-300 ease-in-out overflow-hidden',
        isInteractive && 'cursor-pointer hover:shadow-lg',
        isSelected && 'ring-2 ring-togyz-highlight',
        isHovered && 'scale-105',
        sizeClasses[size],
        className
      )}
      onClick={isInteractive ? onClick : undefined}
      onMouseEnter={() => isInteractive && setIsHovered(true)}
      onMouseLeave={() => isInteractive && setIsHovered(false)}
    >
      {/* Container for pieces */}
      <div className={cn(
        'relative w-full h-full flex items-center justify-center bg-togyz-piece rounded-full',
        isSelected ? 'bg-togyz-highlight/20' : 'bg-togyz-piece/90'
      )}>
        {piecesToShow > 0 && (
          <div className="absolute inset-2 flex flex-wrap items-center justify-center gap-0.5">
            {Array.from({ length: piecesToShow }).map((_, i) => (
              <div 
                key={i}
                className={cn(
                  'rounded-full bg-togyz-pieceDark animate-pulse-gentle',
                  size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
                )}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  opacity: 0.7 + (i * 0.03)
                }}
              />
            ))}
          </div>
        )}
        
        {/* Counter text */}
        <span className={cn(
          'font-semibold text-togyz-boardDark absolute',
          size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
        )}>
          {count}
        </span>
        
        {/* Additional count indicator */}
        {remainingCount > 0 && (
          <div className="absolute -bottom-1 -right-1 bg-togyz-highlight text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            +
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePiece;
