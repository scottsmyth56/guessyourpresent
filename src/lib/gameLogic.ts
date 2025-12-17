export type TileStatus = 'empty' | 'filled' | 'correct' | 'present' | 'absent';

export interface TileState {
  letter: string;
  status: TileStatus;
  isRevealing?: boolean;
  isAnimating?: boolean;
}

export interface GameState {
  board: TileState[][];
  currentRow: number;
  currentCol: number;
  targetWord: string;
  gameStatus: 'playing' | 'won' | 'lost';
  usedLetters: Map<string, TileStatus>;
}

export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;

export function createEmptyBoard(): TileState[][] {
  return Array(MAX_GUESSES).fill(null).map(() =>
    Array(WORD_LENGTH).fill(null).map(() => ({
      letter: '',
      status: 'empty' as TileStatus,
    }))
  );
}

export function evaluateGuess(guess: string, target: string): TileStatus[] {
  const result: TileStatus[] = Array(WORD_LENGTH).fill('absent');
  const targetLetters = target.split('');
  const guessLetters = guess.split('');
  const letterCount = new Map<string, number>();

  // Count letters in target
  targetLetters.forEach(letter => {
    letterCount.set(letter, (letterCount.get(letter) || 0) + 1);
  });

  // First pass: mark correct letters
  guessLetters.forEach((letter, i) => {
    if (letter === targetLetters[i]) {
      result[i] = 'correct';
      letterCount.set(letter, letterCount.get(letter)! - 1);
    }
  });

  // Second pass: mark present letters
  guessLetters.forEach((letter, i) => {
    if (result[i] === 'absent' && letterCount.get(letter)! > 0) {
      result[i] = 'present';
      letterCount.set(letter, letterCount.get(letter)! - 1);
    }
  });

  return result;
}

export function updateUsedLetters(
  usedLetters: Map<string, TileStatus>,
  guess: string,
  statuses: TileStatus[]
): Map<string, TileStatus> {
  const newUsedLetters = new Map(usedLetters);
  
  guess.split('').forEach((letter, i) => {
    const currentStatus = newUsedLetters.get(letter);
    const newStatus = statuses[i];
    
    // Priority: correct > present > absent
    if (newStatus === 'correct') {
      newUsedLetters.set(letter, 'correct');
    } else if (newStatus === 'present' && currentStatus !== 'correct') {
      newUsedLetters.set(letter, 'present');
    } else if (!currentStatus) {
      newUsedLetters.set(letter, newStatus);
    }
  });

  return newUsedLetters;
}
