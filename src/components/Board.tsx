import { TileState } from '@/lib/gameLogic';
import { Tile } from './Tile';
import { cn } from '@/lib/utils';

interface BoardProps {
  board: TileState[][];
  shakeRow?: number;
  bounceRow?: number;
}

export function Board({ board, shakeRow, bounceRow }: BoardProps) {
  return (
    <div className="flex flex-col gap-1.5 p-2">
      {board.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={cn(
            'flex gap-1.5',
            shakeRow === rowIndex && 'tile-shake',
            bounceRow === rowIndex && 'animate-bounce'
          )}
        >
          {row.map((tile, colIndex) => (
            <Tile
              key={colIndex}
              tile={tile}
              delay={colIndex * 300}
              position={colIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
