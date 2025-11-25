"use client";

import { useState } from "react";

export type Difficulty = "Facil" | "Normal" | "Dificil";

interface StartScreenProps {
  onStart: (difficulty: Difficulty) => void;
}

const difficulties: { label: Difficulty; speed: number }[] = [
  { label: "Facil", speed: 400 },
  { label: "Normal", speed: 300 },
  { label: "Dificil", speed: 150 },
];

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [selected, setSelected] = useState<Difficulty>("Normal");

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">🐍 Snake Game</h1>
      <p className="text-lg mb-4">Selecciona la dificultad:</p>
      <div className="flex gap-4 mb-6">
        {difficulties.map(d => (
          <button
            key={d.label}
            onClick={() => setSelected(d.label)}
            className={`px-6 py-2 rounded font-semibold transition-colors
              ${selected === d.label ? "bg-green-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
          >
            {d.label}
          </button>
        ))}
      </div>
      <button
        onClick={() => onStart(selected)}
        className="px-8 py-3 bg-blue-500 rounded-lg font-bold hover:bg-blue-600 transition"
      >
        Comenzar
      </button>
    </div>
  );
};

export default StartScreen;
