import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, GameState } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play } from 'lucide-react';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    onScoreChange(0);
    setFood(generateFood(INITIAL_SNAKE));
    setGameState('PLAYING');
  };

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameState('GAME_OVER');
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, score, onScoreChange, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const update = useCallback((time: number) => {
    if (gameState !== 'PLAYING') return;

    if (time - lastUpdateTimeRef.current > GAME_SPEED) {
      moveSnake();
      lastUpdateTimeRef.current = time;
    }

    gameLoopRef.current = requestAnimationFrame(update);
  }, [gameState, moveSnake]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      gameLoopRef.current = requestAnimationFrame(update);
    } else if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, update]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid (jarring)
    ctx.strokeStyle = 'rgba(255, 0, 255, 0.2)'; // Magenta grid
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#ff00ff'; // Magenta
    ctx.fillRect(
      food.x * cellSize + 1,
      food.y * cellSize + 1,
      cellSize - 2,
      cellSize - 2
    );

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#ffffff' : '#00ffff'; // White head, Cyan body
      
      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
    });

    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full">
      <div className="relative border-4 border-[var(--color-cyan)] bg-black overflow-hidden">
        <canvas
          ref={canvasRef}
          width={420}
          height={420}
          className="bg-transparent block"
        />
        
        <AnimatePresence>
          {gameState === 'IDLE' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 border-4 border-[var(--color-cyan)]"
            >
              <h2 className="text-6xl text-[var(--color-cyan)] mb-6 glitch-text" data-text="SNAKE.EXE">SNAKE.EXE</h2>
              <button
                onClick={resetGame}
                className="px-8 py-3 bg-[var(--color-magenta)] text-black text-2xl hover:bg-[var(--color-cyan)] hover:text-black transition-none cursor-pointer"
              >
                EXECUTE
              </button>
            </motion.div>
          )}

          {gameState === 'GAME_OVER' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 border-4 border-[var(--color-magenta)] screen-tear"
            >
              <h2 className="text-6xl text-[var(--color-magenta)] mb-2 glitch-text" data-text="FATAL_EXCEPTION">FATAL_EXCEPTION</h2>
              <p className="text-[var(--color-cyan)] text-3xl mb-6">MEM_DUMP: {score}</p>
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-[var(--color-cyan)] text-black text-2xl hover:bg-[var(--color-magenta)] hover:text-white transition-none cursor-pointer"
              >
                REBOOT_SYSTEM
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-6 text-[var(--color-magenta)] text-xl uppercase tracking-widest">
        INPUT_REQUIRED: WASD // ARROWS
      </div>
      
      <div className="mt-4 flex flex-col items-center">
        <span className="text-xl text-[var(--color-cyan)] mb-1">ALLOCATED_MEM</span>
        <span className="text-6xl text-white leading-none">{score.toString().padStart(4, '0')}</span>
      </div>
    </div>
  );
}
