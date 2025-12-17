import { TileStatus } from '@/lib/gameLogic';
import { cn } from '@/lib/utils';
import { Delete } from 'lucide-react';

interface KeyboardProps {
  usedLetters: Map<string, TileStatus>;
  onKeyPress: (key: string) => void;
  disabled?: boolean;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];

export function Keyboard({ usedLetters, onKeyPress, disabled }: KeyboardProps) {
  const getKeyClasses = (key: string) => {
    const status = usedLetters.get(key);
    
    switch (status) {
      case 'correct':
        return 'bg-tile-correct text-tile-text border-tile-correct';
      case 'present':
        return 'bg-tile-present text-tile-text border-tile-present';
      case 'absent':
        return 'bg-tile-absent text-tile-text border-tile-absent';
      default:
        return 'bg-key text-key-text hover:bg-secondary';
    }
  };

  return (
    <div className="flex flex-col gap-1.5 px-2 max-w-lg mx-auto">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className={cn(
            'flex gap-1.5 justify-center',
            rowIndex === 1 && 'px-4'
          )}
        >
          {row.map((key) => {
            const isSpecialKey = key === 'ENTER' || key === 'BACKSPACE';
            
            return (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                disabled={disabled}
                className={cn(
                  'h-14 rounded font-semibold uppercase select-none transition-all active:scale-95 border-0',
                  isSpecialKey ? 'px-3 text-xs min-w-[65px]' : 'w-9 sm:w-11 text-sm',
                  getKeyClasses(key),
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {key === 'BACKSPACE' ? (
                  <Delete className="w-5 h-5 mx-auto" />
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
