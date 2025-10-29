import fail from "../../assets/Fail.webm";
import success from "../../assets/Success.webm";

import "../../css/button.css";
import "../../css/playButton.css";
import "../../css/pokemonFade.css";
import { useState } from "react";
import type { Pokemon } from "../../models/Pokemon";
import { getRandomSearchMessage } from "../../utils/loadingMessages";
import { useUser } from "../../context/userContext";
import Searching from "./Screen/Searching";
import Idle from "./Screen/Idle";
import PokemonShown from "./Screen/PokemonShown";
import Catching from "./Screen/Catching";
import Finished from "./Screen/Finished";
import PokedexUpdated from "./Screen/PokedexUpdated";
import { getTypeColor } from "../../utils/typeColors";
import InfoBubble from "./InfoBubble";
import type { PokemonData } from "../../models/UserData";
type Phases =
  | "idle"
  | "searching"
  | "pokemon_shown"
  | "catching"
  | "finished"
  | "updated_pokedex";

const ScreenGame = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { user, setUser, setRenderPokedex, setNewPokemonRender } = useUser();
  if (!user) return;
  const [dummyPokedex, setDummyPokedex] = useState(user.pokedex || {});
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("Searching...");
  const [phase, setPhase] = useState<Phases>("idle");
  const [animation, setAnimation] = useState<string>("");
  const [caught, setCaught] = useState<boolean>(false);
  const [isNewPokemon, setIsNewPokemon] = useState<boolean>(false);
  const [totalObtained, setTotalObtained] = useState<number>(user.obtained);

  const nextScreen = async () => {
    if (isNewPokemon) {
      setPhase("updated_pokedex");
    } else {
      reset();
    }
  };

  const reset = async () => {
    setUser({
      ...user,
      pokedex: dummyPokedex,
      obtained: totalObtained,
    });

    let pokeRender = {
      id: pokemon!.id,
      isShiny: pokemon!.isShiny,
    };
    setNewPokemonRender(pokeRender);
    setRenderPokedex(true);
    setIsNewPokemon(false);
    setPokemon(null);
    setPhase("idle");
  };

  const handleCatch = async (bonus: number) => {
    if (!pokemon || !user) return;

    try {
      // Pasamos el bonus según la pokebola
      const res = await fetch(`${API_URL}/api/users/catchPokemon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user?.uid,
          pokemonId: pokemon.id,
          rarity: pokemon.rarity,
          bonus,
          isShiny: pokemon.isShiny,
        }),
      });

      const data = await res.json();
      console.log(data);
      setCaught(data.caught);

      //  actualizar el dummyPokedex
      setDummyPokedex((prev) => ({
        ...prev,
        [data.pokemonId]: {
          ...prev[data.pokemonId],
          ...data.updatedEntry,
        },
      }));

      //
      setUser({
        ...user,
        masterBalls: data.updatedUser.masterBalls,
      });

      if (data.caught) {
        setPhase("catching");
        setAnimation(success);
        setTotalObtained(data.totalObtained);
      } else {
        setPhase("catching");
        setAnimation(fail);
      }
    } catch (err) {
      console.error(err);
      alert("Error en la captura");
      reset();
    }
  };

  const play = async () => {
    if (!user) return;
    setLoading(true);
    setPhase("searching");
    const minDelay = new Promise<void>((resolve) => setTimeout(resolve, 2000));

    try {
      const res = await fetch(`${API_URL}/api/users/searchPok`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
        }),
      });

      const data: any = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Request error");
      }
      const pokemon: Pokemon = data.pokemon;
      const pokemonData: PokemonData = {
        ...pokemon,
        variants: data.updatedEntry.variants,
      };

      setDummyPokedex((prev) => ({
        ...prev,
        [pokemon.id]: pokemonData,
      }));

      // Actualizamos solo los campos globales del usuario
      setUser({
        ...user,
        dailyCatches: data.dailyCatches,
        seen: data.totalSeen,
        rollResetAt: data.rollResetAt

        // pokedex NO se toca aquí
      });
      setIsNewPokemon(data.isNewPokemon);

      await minDelay;

      const mainImage = pokemon.isShiny
        ? pokemon.animatedShinySprite || pokemon.shinySprite
        : pokemon.animatedSprite || pokemon.sprite;

      const fallbackImage = pokemon.isShiny
        ? pokemon.shinySprite
        : pokemon.sprite;

      // Pre-cargar la imagen principal
      const img = new Image();
      img.src = mainImage;
      img.onload = () => {
        setPokemon(pokemon);
        setLoadingMessage(getRandomSearchMessage());
        setLoading(false);
        setPhase("pokemon_shown");
      };
      img.onerror = () => {
        img.src = fallbackImage;
      };
    } catch (err: any) {
      alert("Error searching pokemon: " + err.message);
      setPokemon(null);
      setLoading(false);
      setPhase("idle");
    }
  };

  return (
    <div
      className="relative z-10 w-full h-[65vh] md:h-[70%] rounded-[15px] flex flex-col justify-between p-3 mt-2 shadow-[0px_11px_0px_-2px_#00000052,inset_0_0_0_7px_rgba(0,0,0,0.05)]"
      style={{ background: getTypeColor(pokemon?.types) }}
    >
      <InfoBubble />
      {phase == "idle" ? (
        <Idle play={play} user={user} setUser={setUser} />
      ) : phase == "searching" && loading ? (
        <Searching loadingMessage={loadingMessage} />
      ) : phase == "pokemon_shown" ? (
        <PokemonShown
          handleCatch={handleCatch}
          pokemon={pokemon!}
          user={user!}
        />
      ) : phase == "catching" ? (
        <Catching animation={animation} setPhase={setPhase} />
      ) : phase == "finished" ? (
        <Finished pokemon={pokemon!} caught={caught} nextScreen={nextScreen} />
      ) : phase == "updated_pokedex" ? (
        <PokedexUpdated pokemon={pokemon!} retry={reset} />
      ) : (
        <div onClick={reset}>Error... click HERE to reset</div>
      )}
    </div>
  );
};

export default ScreenGame;
