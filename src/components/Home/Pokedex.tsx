import { useEffect, useMemo, useState } from "react";
import Switch from "react-switch";
import PokeList from "./Pokedex/PokeList";
import { Pagination } from "./Pokedex/Pagination";
import { useUser } from "../../context/userContext";

const TOTAL_POKEMON = 151;
const POKEMON_PER_PAGE = 5;

const Pokedex = () => {
  const {newPokemonRender, setNewPokemonRender} = useUser()
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(TOTAL_POKEMON / POKEMON_PER_PAGE);

  const pageIds = useMemo(() => {
    const start = (page - 1) * POKEMON_PER_PAGE + 1;
    return Array.from({ length: POKEMON_PER_PAGE }, (_, i) => start + i).filter(
      (id) => id <= TOTAL_POKEMON
    );
  }, [page]);
  const [isShinyList, setIsShinyList] = useState(false);

  useEffect(() => {
    if (newPokemonRender && newPokemonRender?.id) {
      const newPage = Math.ceil(newPokemonRender.id / POKEMON_PER_PAGE);
      setPage(newPage);
      setIsShinyList(newPokemonRender.isShiny)
      console.log("OLLOO");
      setNewPokemonRender(null)
      
    }
  }, [newPokemonRender]);

  return (
    <div className="relative z-10 h-[100%] w-full bg-white rounded-[15px] border-[7px] border-black/10 flex flex-col justify-between items-center p-3 my-2">
      <div className="bg-red-300 rounded-[30px] shadow-[3.5px_3.5px_0px_rgba(0,0,0,0.25)] px-10 py-2 m-2">
        <span className="text-4xl text-white">Pokedex</span>
      </div>

      <div className="flex items-center space-x-2">
        <span>Normal</span>
        <Switch
          onChange={() => setIsShinyList(!isShinyList)}
          checked={isShinyList}
          offColor="#ccc"
          onColor="#FACC15"
          uncheckedIcon={false}
          checkedIcon={false}
          height={20}
          width={40}
        />
        <span>Shiny</span>
      </div>

      <div className="w-full flex justify-center">
        <PokeList isShinyList={isShinyList} listIds={pageIds} />
      </div>

      <div className="w-full">
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>
    </div>
  );
};

export default Pokedex;
