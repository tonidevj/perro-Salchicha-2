"use client";
import { useState } from "react";
import { Difficulty } from "../components/StartScreen";
import StartScreen from "../components/StartScreen";
import SnakeGame from "../components/SnakeGame";



export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("Normal");

  return (
    <>
      {!gameStarted ? (
        <StartScreen
          onStart={(diff) => {
            setDifficulty(diff);
            setGameStarted(true);
          }}
        />
      ) : (
        <SnakeGame
          difficulty={difficulty}
          onBack={() => setGameStarted(false)}
        />
      )}
    </>
  );
}