import { TileState } from '@/lib/gameLogic';
import { cn } from '@/lib/utils';

interface TileProps {
  tile: TileState;
  delay?: number;
  position?: number;
}

export function Tile({ tile, delay = 0, position = 0 }: TileProps) {
  const getStatusClasses = () => {
    switch (tile.status) {
      case 'correct':
        return 'bg-tile-correct border-tile-correct text-tile-text';
      case 'present':
        return 'bg-tile-present border-tile-present text-tile-text';
      case 'absent':
        return 'bg-tile-absent border-tile-absent text-tile-text';
      case 'filled':
        return 'bg-tile-empty border-tile-filled-border text-foreground';
      default:
        return 'bg-tile-empty border-tile-empty-border';
    }
  };

  return (
    <div
      className={cn(
        'w-14 h-14 sm:w-16 sm:h-16 border-2 flex items-center justify-center text-3xl font-bold uppercase select-none transition-colors',
        getStatusClasses(),
        tile.isAnimating && 'tile-pop',
        tile.isRevealing && 'tile-flip'
      )}
      style={{
        animationDelay: tile.isRevealing ? `${delay}ms` : undefined,
      }}
    >
      {tile.letter}
    </div>
  );
}
