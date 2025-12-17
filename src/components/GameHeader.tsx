import { RotateCcw, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameHeaderProps {
  onNewGame: () => void;
  onHelp: () => void;
}

export function GameHeader({ onNewGame, onHelp }: GameHeaderProps) {
  return (
    <header className="w-full border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={onHelp}
          className="text-foreground hover:bg-secondary"
        >
          <HelpCircle className="w-6 h-6" />
        </Button>
        
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          Wordle
        </h1>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onNewGame}
          className="text-foreground hover:bg-secondary"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
