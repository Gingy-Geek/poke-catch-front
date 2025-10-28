import { motion } from "framer-motion";

export default function LoadingPokeball() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-10">
      {/* Pokéball */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="relative w-16 h-16 rounded-full border-[4px] border-black overflow-hidden bg-white"
      >
        {/* Parte superior */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-red-500 border-b-[4px] border-black"></div>

        {/* Botón central */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white border-[4px] border-black rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-black rounded-full"></div>
        </div>
      </motion.div>

      {/* Texto */}
      <p className="mt-4 text-gray-700 font-semibold tracking-wide">
        Loading...
      </p>
    </div>
  );
}
