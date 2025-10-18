import type { Pokemon } from "../../../models/Pokemon";
import specialPB from "../../../assets/specialPB.png";
import normalPB from "../../../assets/normalPB.png";
import { baseCatchRates } from "../../../config/pokemonRates";
import type { UserData } from "../../../models/UserData";
import { getRarityColor } from "../../../utils/rareColors";

const PokemonShown = ({
  handleCatch,
  pokemon,
  user,
}: {
  handleCatch: (bonus: number) => void;
  pokemon: Pokemon;
  user: UserData;
}) => {
  function getCatchPercentage(rarity: Pokemon["rarity"], bonus: number) {
    const base = baseCatchRates[rarity]; // base de captura de rareza
    const total = Math.min(1, base + bonus); // max 100%
    return Math.round(total * 100); // devuelve porcentaje entero
  }

  return (
    <>
      <div className="flex justify-center items-center flex-1">
        <div className="  rounded-[15px] border-[3px] border-black/10 px-2 py-1 text-black/70 absolute z-1 top-[3%] left-[3%]"
             style={{ background: getRarityColor(pokemon.rarity)}}
        >
          {pokemon.rarity}
        </div>
        <img
          style={{ imageRendering: "pixelated" }}
          src={
            pokemon.isShiny
              ? pokemon.animatedShinySprite
              : pokemon.animatedSprite
          }
          alt={pokemon.name}
          className="w-50 h-50 object-contain pokemon-fade"
          onError={(e) => {
            e.currentTarget.src = pokemon.isShiny
              ? pokemon.shinySprite
              : pokemon.sprite;
          }}
        />
      </div>
      <div className="bg-white border-[10px] border-double border-black/70 text-center py-5">
        <span className="text-base lg:text-lg">
          A wild{" "}
          {pokemon.isShiny && (
            <span className="uppercase font-bold text-yellow-400 drop-shadow-lg">
              Shiny{" "}
            </span>
          )}
          <span
            className={`uppercase font-bold ${
              pokemon.isShiny
                ? "text-yellow-400 drop-shadow-lg"
                : "text-blue-500"
            }`}
          >
            {pokemon.name}
          </span>{" "}
          has appeared!
        </span>

        <br />
        <span className="text-sm lg:text-base">Choose your ball:</span>
        <div
          style={{ display: "flex", justifyContent: "space-around" }}
          className="mt-[15px]"
        >
          <button
            disabled={user.masterBalls <= 0}
            onClick={() => handleCatch(0.3)}
            className="botones flex justify-around items-center m-[2px] px-[10px] py-[3px] lg:m-[5px] w-full lg:w-[40%] text-base"
          >
            <img src={specialPB} alt="Play" className="w-[30%]" />
            <div className="flex flex-col">
              <span className="text-sm lg:text-lg">Masterball</span>
              <span className="text-xs lg:text-sm">
                {getCatchPercentage(pokemon.rarity, 0.3)}% chance
              </span>
            </div>
          </button>

          <button
            onClick={() => handleCatch(0)}
            className="botones flex justify-around items-center m-[2px] px-[10px] py-[3px] lg:m-[5px] w-full lg:w-[40%] text-base"
          >
            <img src={normalPB} alt="Play" className="w-[30%]" />
            <div className="flex flex-col">
              <span className="text-sm lg:text-lg">Pokeball</span>
              <span className="text-xs lg:text-sm">
                {getCatchPercentage(pokemon.rarity, 0)}% chance
              </span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default PokemonShown;
