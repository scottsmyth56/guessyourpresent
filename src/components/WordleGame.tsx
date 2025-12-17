import { useState, useEffect, useCallback } from 'react';
import { Board } from './Board';
import { Keyboard } from './Keyboard';
import { GameHeader } from './GameHeader';
import { GameMessage } from './GameMessage';
import { HelpDialog } from './HelpDialog';
import {
  GameState,
  TileState,
  createEmptyBoard,
  evaluateGuess,
  updateUsedLetters,
  WORD_LENGTH,
  MAX_GUESSES,
} from '@/lib/gameLogic';
import { getRandomWord, isValidWord } from '@/lib/words';

const REVEAL_DELAY = 300;

export function WordleGame() {
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: createEmptyBoard(),
    currentRow: 0,
    currentCol: 0,
    targetWord: getRandomWord(),
    gameStatus: 'playing',
    usedLetters: new Map(),
  }));

  const [message, setMessage] = useState<{ text: string; visible: boolean; type: 'error' | 'success' | 'info' }>({ text: '', visible: false, type: 'info' });
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  const showMessage = useCallback((text: string, type: 'error' | 'success' | 'info' = 'info', duration = 2000) => {
    setMessage({ text, visible: true, type });
    setTimeout(() => setMessage(prev => ({ ...prev, visible: false })), duration);
  }, []);

  const triggerShake = useCallback(() => {
    setShakeRow(gameState.currentRow);
    setTimeout(() => setShakeRow(null), 500);
  }, [gameState.currentRow]);

  const handleNewGame = useCallback(() => {
    setGameState({
      board: createEmptyBoard(),
      currentRow: 0,
      currentCol: 0,
      targetWord: getRandomWord(),
      gameStatus: 'playing',
      usedLetters: new Map(),
    });
    setMessage({ text: '', visible: false, type: 'info' });
  }, []);

  const addLetter = useCallback((letter: string) => {
    if (gameState.gameStatus !== 'playing') return;
    if (gameState.currentCol >= WORD_LENGTH) return;

    setGameState(prev => {
      const newBoard = prev.board.map(row => row.map(tile => ({ ...tile })));
      newBoard[prev.currentRow][prev.currentCol] = {
        letter,
        status: 'filled',
        isAnimating: true,
      };

      // Remove animation flag after a short delay
      setTimeout(() => {
        setGameState(p => {
          const board = p.board.map(row => row.map(tile => ({ ...tile })));
          if (board[prev.currentRow][prev.currentCol]) {
            board[prev.currentRow][prev.currentCol].isAnimating = false;
          }
          return { ...p, board };
        });
      }, 100);

      return {
        ...prev,
        board: newBoard,
        currentCol: prev.currentCol + 1,
      };
    });
  }, [gameState.gameStatus, gameState.currentCol]);

  const removeLetter = useCallback(() => {
    if (gameState.gameStatus !== 'playing') return;
    if (gameState.currentCol === 0) return;

    setGameState(prev => {
      const newBoard = prev.board.map(row => row.map(tile => ({ ...tile })));
      newBoard[prev.currentRow][prev.currentCol - 1] = {
        letter: '',
        status: 'empty',
      };

      return {
        ...prev,
        board: newBoard,
        currentCol: prev.currentCol - 1,
      };
    });
  }, [gameState.gameStatus, gameState.currentCol]);

  const submitGuess = useCallback(() => {
    if (gameState.gameStatus !== 'playing') return;
    if (gameState.currentCol !== WORD_LENGTH) {
      showMessage('Not enough letters', 'error');
      triggerShake();
      return;
    }

    const currentGuess = gameState.board[gameState.currentRow]
      .map(tile => tile.letter)
      .join('');

    if (!isValidWord(currentGuess)) {
      showMessage('Not in word list', 'error');
      triggerShake();
      return;
    }

    const statuses = evaluateGuess(currentGuess, gameState.targetWord);
    const newUsedLetters = updateUsedLetters(gameState.usedLetters, currentGuess, statuses);

    // Reveal tiles with animation
    setGameState(prev => {
      const newBoard = prev.board.map(row => row.map(tile => ({ ...tile })));
      
      statuses.forEach((status, i) => {
        newBoard[prev.currentRow][i] = {
          letter: newBoard[prev.currentRow][i].letter,
          status,
          isRevealing: true,
        };
      });

      return { ...prev, board: newBoard };
    });

    // After reveal animation, update game state
    const revealDuration = WORD_LENGTH * REVEAL_DELAY + 500;
    
    setTimeout(() => {
      setGameState(prev => {
        const newBoard = prev.board.map(row => row.map(tile => ({ ...tile, isRevealing: false })));
        
        const isWin = currentGuess === prev.targetWord;
        const isLoss = prev.currentRow === MAX_GUESSES - 1 && !isWin;
        
        let newStatus: 'playing' | 'won' | 'lost' = 'playing';
        
        if (isWin) {
          newStatus = 'won';
          const messages = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!'];
          showMessage(messages[prev.currentRow] || 'Great!', 'success', 3000);
        } else if (isLoss) {
          newStatus = 'lost';
          showMessage(prev.targetWord, 'info', 5000);
        }

        return {
          ...prev,
          board: newBoard,
          currentRow: prev.currentRow + 1,
          currentCol: 0,
          gameStatus: newStatus,
          usedLetters: newUsedLetters,
        };
      });
    }, revealDuration);
  }, [gameState, showMessage, triggerShake]);

  const handleKeyPress = useCallback((key: string) => {
    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACKSPACE') {
      removeLetter();
    } else if (key.length === 1 && /^[A-Z]$/.test(key)) {
      addLetter(key);
    }
  }, [submitGuess, removeLetter, addLetter]);

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      
      const key = e.key.toUpperCase();
      
      if (key === 'ENTER') {
        e.preventDefault();
        handleKeyPress('ENTER');
      } else if (key === 'BACKSPACE') {
        e.preventDefault();
        handleKeyPress('BACKSPACE');
      } else if (/^[A-Z]$/.test(key)) {
        e.preventDefault();
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GameHeader onNewGame={handleNewGame} onHelp={() => setHelpOpen(true)} />
      
      <main className="flex-1 flex flex-col items-center justify-between py-4 gap-4">
        <div className="flex-1 flex items-center">
          <Board 
            board={gameState.board} 
            shakeRow={shakeRow ?? undefined}
          />
        </div>
        
        <div className="w-full pb-4">
          <Keyboard
            usedLetters={gameState.usedLetters}
            onKeyPress={handleKeyPress}
            disabled={gameState.gameStatus !== 'playing'}
          />
        </div>
      </main>

      <GameMessage 
        message={message.text} 
        visible={message.visible} 
        type={message.type}
      />
      
      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  );
}
