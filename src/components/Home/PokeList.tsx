import { useCallback, useEffect, useState } from "react";
import Modal from "react-modal";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import CloseIcon from "@mui/icons-material/Close";

import Question from "../../assets/question.png";

import "../../css/button.css";
import "../../css/cards.css";
import { useUser } from "../../context/userContext";
import type { PokemonData } from "../../models/UserData";
import { getTypeColor } from "../../utils/typeColors";
import { getRarityColor } from "../../utils/rareColors";
interface PlaceHolder {
  id: number;
  sprite: string;
  spriteFallback: string;
  name: string;
  obtained: number;
}

interface PokeListProps {
  isShinyList: boolean;
  listIds: number[];
}

const PokeList = ({ isShinyList, listIds }: PokeListProps) => {
  const { user, renderPokedex, setRenderPokedex } = useUser();
  if (!user) return null;
  const [selectedPoke, setSelectedPoke] = useState<PokemonData | null>(null);
  const [pokeData, setPokeData] = useState<PlaceHolder[]>([]);

  const handleOpenModal = (poke: PlaceHolder) => {
    const pokemon = user.pokedex[poke.id]
    if (pokemon) {
      if(pokemon.variants.normal.obtained > 0 && !isShinyList){
        setSelectedPoke(pokemon);
      }else if(pokemon.variants.shiny.obtained > 0 && isShinyList){
        setSelectedPoke(pokemon)
      }
    }
  };

  const getPokeData = useCallback(
    (id: number) => {
      const poke = user.pokedex[id];

      const placeholder = {
        id,
        name: "???",
        obtained: 0,
        sprite: Question,
        spriteFallback: Question,
      };

      if (!poke) return placeholder;

      const variantKey = isShinyList ? "shiny" : "normal";
      const variant = poke.variants?.[variantKey];

      if (!variant || variant.seen <= 0) return placeholder;

      return {
        id,
        name: poke.name,
        obtained: variant.obtained,
        sprite: isShinyList ? poke.animatedShinySprite : poke.animatedSprite,
        spriteFallback: isShinyList ? poke.shinySprite : poke.sprite,
      };
    },
    [user, isShinyList]
  );

  const playAudio = () => {
    if (selectedPoke && selectedPoke.audio) {
      const audio = new Audio(selectedPoke.audio);
      audio.volume = 0.1
      audio.play();
    }
  };

  useEffect(() => {
    if (!user) return;

    if (renderPokedex) {
      console.log("REender Pokedex variable");
      const data = listIds.map((id) => getPokeData(id));
      setPokeData(data);
      setRenderPokedex(false);
    }
  }, [renderPokedex]);

  useEffect(() => {
    if (!user) return;
    console.log("REender Pokedex sin variable");
    const data = listIds.map((id) => getPokeData(id));
    setPokeData(data);
  }, [listIds, isShinyList]);

  return (
    <div className="w-full px-2">
      {pokeData.map((poke, i) => (
        <div
          key={i}
          className={`botones ${isShinyList ? "shiny" : ""} group flex items-center w-full pl-1.5 my-3 cursor-pointer`}
          onClick={() => handleOpenModal(poke)}
        >
          <div className="w-[15%]">#{poke.id}</div>
          <div className="md:w-[18%] py-2 text-center">
            <img
              style={{ imageRendering: "pixelated"}}
              src={poke.sprite}
              alt="icon"
              className={`w-15 h-15 mx-auto my-[-6px] ${poke.obtained == 0 ? "grayscale" : ""}`}
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.src = poke.spriteFallback;
              }}
            />
          </div>
          <div className="w-[40%] md:w-[45%]">{poke.name}</div>
          <div className={`w-[30%] md:w-[25%] ml-[2px] px-1 self-stretch flex items-center justify-between
          [border-radius:20px_8px_8px_0px]
          ${isShinyList
            ? "bg-yellow-300 group-hover:bg-yellow-400 group-active:bg-yellow-500"
            : "bg-gray-200 group-hover:bg-red-200 group-active:bg-red-200"
          }`}>
            <span className="text-xs md:text-base">Captured:</span>
            <span className="text-sm md:text-base">{poke.obtained}</span>
          </div>
        </div>
      ))}

      <Modal
        isOpen={!!selectedPoke}
        onRequestClose={() => setSelectedPoke(null)}
        appElement={document.getElementById("root")!}
        className="w-full md:w-3/4 lg:w-1/2 mx-auto md:my-20 outline-none"
        overlayClassName="fixed inset-0 bg-black/50 z-10 flex items-center justify-center"
      >
        {selectedPoke && (
          <div className="flex flex-col mx-2">
            <div
              className="relative rounded-[15px] flex items-center shadow-[0px_11px_0px_-2px_#00000052,inset_0_0_0_4px_rgba(0,0,0,0.05)] p-3"
              style={{ background: getTypeColor(selectedPoke.types) }}
            >
              <span className="text-lg">#{selectedPoke.id}</span>
              <span className="ml-4 text-4xl text-black [text-shadow:2px_2px_1px_#00000042]">
                {selectedPoke.name}
              </span>
              <button
                className="botones absolute right-[3%] flex"
                onClick={() => setSelectedPoke(null)}
              >
                <CloseIcon className="m-0 p-0" fontSize="small" />
              </button>
            </div>
            <div className="p-2 mt-[-25px]  bg-gray-200 rounded-[15px] border-[7px] border-black/10">
              <div className="flex flex-col items-start mt-[20px]">
                <span className="mb-1">Types:</span>
                <div>
                  {selectedPoke.types.map((type, i) => (
                    <span
                      key={i}
                      className="rounded-[15px] border-[3px] border-black/10 px-2 text-sm md:text-base md:py-1 mr-2"
                      style={{
                        background: getTypeColor(selectedPoke.types[i]),
                      }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col my-3">
                <span className="mb-1">Weaknesses:</span>
                <div className="flex items-center flex-wrap">
                    {selectedPoke.weaknesses.map((weakness, i) => (
                      <span
                        key={i}
                        className="rounded-[15px] border-[3px] border-black/10 px-2 text-sm md:text-base md:py-1 mr-2"
                        style={{
                          background: getTypeColor(selectedPoke.weaknesses[i]),
                        }}
                      >
                        {weakness}
                      </span>
                    ))}
                </div>
              </div>
              <div className="flex w-full mt-2 py-2 flex-col md:flex-row">
                <div className="w-full md:w-1/2 flex flex-col justify-between">
                  <div className="card flex flex-col p-2 ">
                    {/* STATS */}
                    <div className="flex justify-between">
                      <span>
                        Height:{" "}
                        <span className="text-gray-400">
                          {selectedPoke.height}m
                        </span>
                      </span>
                      <span>
                        Weight:{" "}
                        <span className="text-gray-400">
                          {selectedPoke.weight}kg
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        Atk:{" "}
                        <span className="text-gray-400">
                          {selectedPoke.stats.attack}
                        </span>
                      </span>

                      <span>
                        Speed:{" "}
                        <span className="text-gray-400">
                          {selectedPoke.stats.speed}
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        Hp:{" "}
                        <span className="text-gray-400">
                          {selectedPoke.stats.hp}
                        </span>
                      </span>
                      <span>
                        Def:{" "}
                        <span className="text-gray-400">
                          {selectedPoke.stats.defense}
                        </span>
                      </span>
                    </div>

                    <span className="mt-2">
                      Description:{" "}
                      <span className="text-sm text-gray-400">
                        {selectedPoke.description}
                      </span>
                    </span>
                  </div>

                  <div className="card relative flex flex-col p-2 mt-4">
                    <span>
                      Captured:{" "}
                      <span className="text-gray-400">
                        {isShinyList
                          ? selectedPoke.variants.shiny.obtained
                          : selectedPoke.variants.normal.obtained}
                      </span>
                    </span>
                    <span>
                      Seen:{" "}
                      <span className="text-gray-400">
                        {isShinyList
                          ? selectedPoke.variants.shiny.seen
                          : selectedPoke.variants.normal.seen}
                      </span>
                    </span>

                    <div className="absolute inset-y-0 right-2 flex items-center">
                      <span
                        className=" rounded-[15px] border-[3px] border-black/10 px-2 md:py-1 mr-2"
                        style={{
                          background: getRarityColor(selectedPoke.rarity),
                        }}
                      >
                        {selectedPoke.rarity}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 flex flex-col items-center justify-between">
                  <div>
                    <img
                      style={{ imageRendering: "pixelated" }}
                      src={
                        isShinyList
                          ? selectedPoke.animatedShinySprite
                          : selectedPoke.animatedSprite
                      }
                      alt={selectedPoke.name}
                      className="w-25 h-25 md:w-35 md:h-35 object-contain"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.src = isShinyList
                          ? selectedPoke.shinySprite
                          : selectedPoke.sprite;
                      }}
                    />
                  </div>
                  <div>
                    <button
                      className="botones ml-[-25px] px-[3px] py-[3px]"
                      onClick={playAudio}
                    >
                      <VolumeUpIcon className="" fontSize="medium" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PokeList;
