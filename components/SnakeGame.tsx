"use client";

import { useRef, useEffect } from "react";
import { useSnake } from "@/hooks/useSnake";

const CELL_SIZE = 20;
const BOARD_SIZE = 20;

const FRAME_WIDTH = 1024;
const FRAME_HEIGHT = 1024;
const TOTAL_FRAMES = 6;

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Imagen completa (solo antes de comer)
  const dogFull = useRef<HTMLImageElement | null>(null);

  // Partes después de comer
  const dogHead = useRef<HTMLImageElement | null>(null);
  const dogBody = useRef<HTMLImageElement | null>(null);
  const dogCurve = useRef<HTMLImageElement | null>(null);
  const dogTail = useRef<HTMLImageElement | null>(null);

  const { snake, food, gameOver, score, resetGame } = useSnake(300);

  const loadImg = (src: string) => {
    const img = new Image();
    img.src = src;
    return img;
  };

  // Cargar sprites
  useEffect(() => {
    dogFull.current = loadImg("/sprites/pug.png");
    dogHead.current = loadImg("/sprites/pug_head.png");
    dogBody.current = loadImg("/sprites/pug_body.png");
    dogCurve.current = loadImg("/sprites/pug_curve.png");
    dogTail.current = loadImg("/sprites/pug_tail.png");
  }, []);

  const tickRef = useRef(0);

  // Determina si un segmento es curvo
  const isCurve = (prev: number[], curr: number[], next: number[]) => {
    const [px, py] = prev;
    const [cx, cy] = curr;
    const [nx, ny] = next;

    return (
      (px !== nx && py !== ny) // si x y y cambian → es curva
    );
  };

  // DIBUJAR SNAKE
  const drawSnake = (ctx: CanvasRenderingContext2D) => {
    const tick = tickRef.current;
    const frame = Math.floor(tick / 4) % TOTAL_FRAMES;
    tickRef.current++;

    const size = 120;
    const off = size / 2;

    // 🔹 Antes de comer: perro completo
    if (score === 0) {
      const [x, y] = snake[0];

      ctx.drawImage(
        dogFull.current!,
        frame * FRAME_WIDTH,
        0,
        FRAME_WIDTH,
        FRAME_HEIGHT,
        x * CELL_SIZE - off,
        y * CELL_SIZE - off,
        size,
        size
      );
      return;
    }

    // 🔹 Después de comer: partes
    snake.forEach((seg, i) => {
      const [sx, sy] = seg;
      const px = sx * CELL_SIZE - off;
      const py = sy * CELL_SIZE - off;

      // Cabeza
      if (i === 0) {
        ctx.drawImage(
          dogHead.current!,
          frame * FRAME_WIDTH,
          0,
          FRAME_WIDTH,
          FRAME_HEIGHT,
          px,
          py,
          size,
          size
        );
        return;
      }

      // Cola
      if (i === snake.length - 1) {
        ctx.drawImage(
          dogTail.current!,
          0,
          0,
          FRAME_WIDTH,
          FRAME_HEIGHT,
          px,
          py,
          size,
          size
        );
        return;
      }

      // Curva
      const prev = snake[i - 1];
      const next = snake[i + 1];

      if (isCurve(prev, seg, next)) {
        ctx.drawImage(
          dogCurve.current!,
          0,
          0,
          FRAME_WIDTH,
          FRAME_HEIGHT,
          px,
          py,
          size,
          size
        );
        return;
      }

      // Cuerpo recto
      ctx.drawImage(
        dogBody.current!,
        0,
        0,
        FRAME_WIDTH,
        FRAME_HEIGHT,
        px,
        py,
        size,
        size
      );
    });
  };

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, BOARD_SIZE * CELL_SIZE, BOARD_SIZE * CELL_SIZE);

    ctx.fillStyle = "red";
    ctx.fillRect(food[0] * CELL_SIZE, food[1] * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    drawSnake(ctx);
  }, [snake, food, score]);

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold mb-4">Snake Profesional</h1>

      <canvas
        ref={canvasRef}
        width={BOARD_SIZE * CELL_SIZE}
        height={BOARD_SIZE * CELL_SIZE}
        className="border-4 border-gray-700 bg-gray-900"
      />
    </div>
  );
};

export default SnakeGame;
