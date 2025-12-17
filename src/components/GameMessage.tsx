import { cn } from '@/lib/utils';

interface GameMessageProps {
  message: string;
  visible: boolean;
  type?: 'error' | 'success' | 'info';
}

export function GameMessage({ message, visible, type = 'info' }: GameMessageProps) {
  return (
    <div
      className={cn(
        'fixed top-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded font-semibold text-sm transition-all duration-300 z-50',
        type === 'error' && 'bg-foreground text-background',
        type === 'success' && 'bg-tile-correct text-tile-text',
        type === 'info' && 'bg-foreground text-background',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      )}
    >
      {message}
    </div>
  );
}
