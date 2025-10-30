import { useCallback, useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import CloseIcon from "@mui/icons-material/Close";

import Question from "../../../assets/question.png";
import ShinyIcon from "../../../assets/shines.png";

import "../../../css/button.css";
import "../../../css/cards.css";
import { useUser } from "../../../context/userContext";
import type { PokemonData } from "../../../models/UserData";
import { getTypeColor } from "../../../utils/typeColors";
import { getRarityColor } from "../../../utils/rareColors";
import { motion, AnimatePresence } from "framer-motion";

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
  const isMobile = window.innerWidth <= 768;
  const listRef = useRef<HTMLDivElement>(null);

  const capitalizeFirstLetter = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  };

  const handleOpenModal = (poke: PlaceHolder) => {
    const pokemon = user.pokedex[poke.id];
    if (pokemon) {
      if (pokemon.variants.normal.obtained > 0 && !isShinyList) {
        setSelectedPoke(pokemon);
      } else if (pokemon.variants.shiny.obtained > 0 && isShinyList) {
        setSelectedPoke(pokemon);
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
    if (selectedPoke?.audio) {
      console.log(selectedPoke.audio);
      const audio = new Audio(selectedPoke.audio);
      audio.volume = 0.1;
      audio
        .play()
        .then(() => {
          console.log("Reproducción iniciada");
        })
        .catch((err) => console.error("Error al reproducir el audio:", err));
    }
  };

  useEffect(() => {
    if (!user) return;

    if (renderPokedex) {
      console.log("REender Pokedex variable");
      const data = listIds.map((id) => getPokeData(id));
      setPokeData(data);
      setRenderPokedex(false);
      if (isMobile && listRef.current) {
        listRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [renderPokedex]);

  useEffect(() => {
    if (!user) return;
    console.log("REender Pokedex sin variable");
    const data = listIds.map((id) => getPokeData(id));
    setPokeData(data);
  }, [listIds, isShinyList]);

  return (
    <div ref={listRef} className="w-full px-0">
      <AnimatePresence mode="wait">
        {pokeData.length === 0 ? (
          <motion.div
            key="no-data"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-4xl py-4 text-gray-500"
          >
            No data
          </motion.div>
        ) : (
          <motion.div
            key={`${listIds.join("-")}-${isShinyList}-${pokeData.length}`}
            variants={{
              hidden: { opacity: 1 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.04 },
              },
            }}
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            {pokeData.map((poke, i) => (
              <motion.div
                key={i}
                className={`botones ${
                  isShinyList ? "shiny" : ""
                } group flex items-center w-full pl-1.5 my-3 cursor-pointer`}
                onClick={() => handleOpenModal(poke)}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-[15%]">#{poke.id}</div>
                <div className="md:w-[18%] py-2 text-center">
                  <div className="w-15 h-15 mx-auto my-[-6px] flex justify-center items-center">
                    <img
                      style={{ imageRendering: "pixelated" }}
                      src={poke.sprite}
                      alt="icon"
                      className={`${
                        poke.obtained === 0 ? "grayscale" : ""
                      } max-w-full max-h-full object-contain`}
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.src = poke.spriteFallback;
                      }}
                    />
                  </div>
                </div>
                <div className="w-[40%] md:w-[45%] md:ml-2">
                  {capitalizeFirstLetter(poke.name)}
                </div>
                <div
                  className={`w-[30%] xl:px-3 ml-[2px] self-stretch flex items-center justify-between
            [border-radius:20px_8px_8px_0px]
            ${
              isShinyList
                ? "bg-yellow-300 group-hover:bg-yellow-400 group-active:bg-yellow-500"
                : "bg-gray-200 group-hover:bg-red-200 group-active:bg-red-200"
            }`}
                >
                  <span className="text-xs md:text-base">Captured:</span>
                  <span className="text-xs md:text-base">{poke.obtained}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <Modal
        isOpen={!!selectedPoke}
        onRequestClose={() => setSelectedPoke(null)}
        appElement={document.getElementById("root")!}
        className="w-full md:w-3/4 xl:w-1/2 mx-auto md:my-20 outline-none"
        overlayClassName="fixed inset-0 bg-black/50 z-10 flex items-center justify-center"
      >
        {selectedPoke && (
          <div className="flex flex-col mx-2">
            <div
              className="relative rounded-[15px] flex items-center shadow-[0px_11px_0px_-2px_#00000052,inset_0_0_0_4px_rgba(0,0,0,0.05)] p-3 z-1"
              style={{ background: getTypeColor(selectedPoke.types) }}
            >
              <span className="text-lg">#{selectedPoke.id}</span>
              <span
                className={`ml-4 text-4xl 
                ${isShinyList ? "text-yellow-400" : "text-black"}`}
                style={{
                  textShadow: isShinyList
                    ? "2px 2px 3px #00000066"
                    : "2px 2px 1px #00000042",
                }}
              >
                {capitalizeFirstLetter(selectedPoke.name)}
              </span>
              <button
                className="botones absolute right-[3%] flex"
                onClick={() => setSelectedPoke(null)}
              >
                <CloseIcon className="m-0 p-0" fontSize="small" />
              </button>
            </div>
            <div className="relative p-2 md:p-5 mt-[-25px]  bg-gray-200 rounded-[15px] border-[7px] border-black/10">
              {isShinyList && (
                <img
                  src={ShinyIcon}
                  alt=""
                  className="absolute h-15 w-15 md:h-20 md:w-20 top-10 right-5"
                />
              )}

              <div className="flex flex-col items-start mt-[20px]">
                <span className="mb-1 text-base md:text-lg">Types:</span>
                <div>
                  {selectedPoke.types.map((type, i) => (
                    <span
                      key={i}
                      className="rounded-[15px] border-[3px] border-black/10 px-2 text-base md:text-lg md:py-1 mr-2"
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
                <span className="mb-1 text-base md:text-lg">Weaknesses:</span>
                <div className="flex items-center flex-wrap">
                  {selectedPoke.weaknesses.map((weakness, i) => (
                    <span
                      key={i}
                      className="rounded-[15px] border-[3px] border-black/10 px-2 text-base md:text-lg md:py-1 mr-2"
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
                      <span className="text-base md:text-lg">
                        Height:{" "}
                        <span className="text-gray-400">
                          {selectedPoke.height}m
                        </span>
                      </span>
                      <span className="text-base md:text-lg">
                        Weight:{" "}
                        <span className="text-gray-400">
                          {selectedPoke.weight}kg
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base md:text-lg">
                        Atk:{" "}
                        <span className="text-gray-400">
                          {selectedPoke.stats.attack}
                        </span>
                      </span>

                      <span className="text-base md:text-lg">
                        Speed:{" "}
                        <span className="text-gray-400">
                          {selectedPoke.stats.speed}
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base md:text-lg">
                        Hp:{" "}
                        <span className="text-gray-400">
                          {selectedPoke.stats.hp}
                        </span>
                      </span>
                      <span className="text-base md:text-lg">
                        Def:{" "}
                        <span className="text-gray-400">
                          {selectedPoke.stats.defense}
                        </span>
                      </span>
                    </div>

                    <span className="mt-2 text-base md:text-lg">
                      Description:{" "}
                      <span className="text-base text-gray-400">
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
