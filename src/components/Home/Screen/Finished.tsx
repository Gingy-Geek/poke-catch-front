import { useEffect, useState } from "react";
import type { Pokemon } from "../../../models/Pokemon";
import playIcon from "../../../assets/playIcon.png";
import { getRarityColor } from "../../../utils/rareColors";

const Finished = ({
  pokemon,
  caught,
  nextScreen,
}: {
  pokemon: Pokemon;
  caught: boolean;
  nextScreen: () => void;
}) => {
  const [showTitle, setShowTitle] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowTitle(true); // fade in titulo
    const timer = setTimeout(() => setShowContent(true), 1200); // fade in contenido inferior
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="relative flex justify-center items-center flex-1">
        <div
          className={`absolute text-5xl top-[80%] -translate-y-1/2 font-bold transition-opacity duration-700 ${
            showTitle ? "opacity-100" : "opacity-0"
          } ${caught ? "text-green-600" : "text-red-600"}`}
        >
          {caught ? "Success!" : "Missed!"}
        </div>
        <div className="  rounded-[15px] border-[3px] border-black/10 px-2 py-1 text-black/70 absolute z-1 top-[3%] left-[3%]"
             style={{ background: getRarityColor(pokemon.rarity)}}
        >
          {pokemon.rarity}
        </div>         
        <img
          style={{ imageRendering: "pixelated" }}
          src={pokemon.isShiny ? pokemon.animatedShinySprite : pokemon.animatedSprite}
          alt={pokemon.name}
          className={`w-32 h-32 object-contain filter ${
            caught ? "grayscale-0" : "grayscale"
          }`}
          onError={(e) => {
            e.currentTarget.src = pokemon.isShiny ? pokemon.shinySprite : pokemon.sprite;
          }}
        />
      </div>

      <div
        className={`bg-white border-[10px] border-double border-black/70 text-center py-5 transition-opacity duration-700 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
       <span className="text-base lg:text-lg">
        {caught ? (
            <>
            You caught{" "}
            <span
                className={`font-bold ${
                pokemon.isShiny
                    ? "text-yellow-400 drop-shadow-lg"
                    : "text-blue-500 drop-shadow-sm"
                }`}
            >
                {pokemon.isShiny ? "Shiny " : ""}
                {pokemon.name.toUpperCase()}
            </span>
            !
            </>
        ) : (
            <>
            Oh no!{" "}
            <span
                className={`font-bold ${
                pokemon.isShiny
                    ? "text-yellow-400 drop-shadow-lg"
                    : "text-blue-500 drop-shadow-sm"
                }`}
            >
                {pokemon.isShiny ? "Shiny " : ""}
                {pokemon.name.toUpperCase()}
            </span>
            {" "}escaped!
            </>
        )}
        </span>

        <div
          style={{ display: "flex", justifyContent: "center" }}
          className="mt-[15px]"
        >
          <button
            onClick={nextScreen}
            className="botones flex items-center text-3xl px-2"
          >
            CONTINUE
            <img src={playIcon} alt="" className="ml-5 w-5 opacity-50" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Finished;
