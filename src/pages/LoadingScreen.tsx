// src/LoadingScreen.tsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const LOADING_TEXTS = [
  "Pinging the server...",
  "Waking up the server...",
  "Herding the Pokémons...",
  "Charging Pokéballs...",
];

interface LoadingScreenProps {
  duration?: number; // duración total en ms
}

export default function LoadingScreen({ duration = 3000 }: LoadingScreenProps) {
  const [visibleTexts, setVisibleTexts] = useState<number>(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = 30;
    const totalTicks = duration / interval;
    let tick = 0;

    const timer = setInterval(() => {
      tick++;
      setProgress(Math.min(100, (tick / totalTicks) * 100));

      // Cada tercera parte del tiempo mostramos un texto más
      const newVisible = Math.floor((tick / totalTicks) * LOADING_TEXTS.length);
      setVisibleTexts(Math.min(LOADING_TEXTS.length, newVisible + 1));

      if (tick >= totalTicks) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [duration]);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-100 p-4 gap-8">
      {/* Texto principal */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl sm:text-4xl font-bold text-gray-700 drop-shadow-md"
      >
        Loading…
      </motion.h1>

      {/* Barra de progreso */}
      <div className="w-3/4 max-w-md h-4 bg-gray-300 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#ff5c5c]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.03 }}
        />
      </div>

      {/* Textos */}
      <div className="flex flex-col items-center gap-2">
        {LOADING_TEXTS.slice(0, visibleTexts).map((text, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden"
          >
            {/* Texto */}
            <span className="relative z-10 text-gray-700 font-semibold text-lg sm:text-xl">
              {text}
            </span>

            {/* Efecto shimmer */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-white/30 mix-blend-screen"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
