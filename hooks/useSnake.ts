import { useState, useEffect, useRef, useCallback } from "react";



export type Position = [number, number];
export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const BOARD_SIZE = 20;

export const useSnake = (initialSpeed = 300) => {
  const [snake, setSnake] = useState<Position[]>([[10, 10]]);
  const [food, setFood] = useState<Position>([5, 5]);
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(initialSpeed);

  const directionRef = useRef<Direction>("RIGHT");     // dirección actual
  const nextDirectionRef = useRef<Direction>("RIGHT"); // dirección pendiente 

const moveSnake = useCallback(() => {
  // Actualizar dirección según la tecla más reciente
  directionRef.current = nextDirectionRef.current;
  const dir = directionRef.current;

  setSnake(prev => {
    const newHead: Position = [...prev[0]] as Position;

    switch (dir) {
      case "UP": newHead[1] -= 1; break;
      case "DOWN": newHead[1] += 1; break;
      case "LEFT": newHead[0] -= 1; break;
      case "RIGHT": newHead[0] += 1; break;
    }

    // Colisiones con paredes
    if (newHead[0] < 0 || newHead[0] >= BOARD_SIZE || newHead[1] < 0 || newHead[1] >= BOARD_SIZE) {
      setGameOver(true);
      return prev;
    }

    // Colisión con sí misma
    if (prev.some(([x, y]) => x === newHead[0] && y === newHead[1])) {
      setGameOver(true);
      return prev;
    }

    const newSnake = [newHead, ...prev];

    // Comer comida
    const isNear = (a: number, b: number) => Math.abs(a - b) <= 4;
    
    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      setScore(prevScore => prevScore + 1);
      setFood(generateFood(newSnake));
      setSpeed(prev => Math.max(50, prev - 10)); // aumentar velocidad
    } else {
      newSnake.pop();
    }

    return newSnake;
  });
}, [food]);
  const resetGame = () => {
    setSnake([[10, 10]]);
    setFood([5, 5]);
    setDirection("RIGHT");
    setGameOver(false);
    setScore(0);
    setSpeed(initialSpeed);
  };

  // Captura de teclas
useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const newDir: Direction | null = (() => {
        switch (e.key) {
          case "ArrowUp": return "UP";
          case "ArrowDown": return "DOWN";
          case "ArrowLeft": return "LEFT";
          case "ArrowRight": return "RIGHT";
          default: return null;
        }
      })();

      if (!newDir) return;

      // Evitar dirección opuesta
      const opposite = (dir: Direction) => {
        switch (dir) {
          case "UP": return "DOWN";
          case "DOWN": return "UP";
          case "LEFT": return "RIGHT";
          case "RIGHT": return "LEFT";
        }
      };

      if (newDir !== opposite(directionRef.current)) {
        nextDirectionRef.current = newDir;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Intervalo del juego
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [moveSnake, gameOver, speed]);

  return { snake, food, gameOver, direction , score, resetGame }; 
};

// Genera comida en posición aleatoria sin tocar la snake
const generateFood = (snake: Position[]): Position => {
  let position: Position;
  do {
    position = [
      Math.floor(Math.random() * BOARD_SIZE),
      Math.floor(Math.random() * BOARD_SIZE),
    ];
  } while (snake.some(([x, y]) => x === position[0] && y === position[1]));
  return position;
};

 
