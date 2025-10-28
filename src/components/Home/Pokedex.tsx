import { useEffect, useMemo, useRef, useState } from "react";
import Switch from "react-switch";
import PokeList from "./Pokedex/PokeList";
import { Pagination } from "./Pokedex/Pagination";
import { useUser } from "../../context/userContext";
import Filter from "../../assets/filter.png";

const Pokedex = () => {
  const { newPokemonRender, setNewPokemonRender, user } = useUser();
  if(!user) return
  const [page, setPage] = useState(1);
  const [isShinyList, setIsShinyList] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState<"All" | "Seen" | "Captured">(
    "All"
  );
  const totalPokemon = 151;
  const sortRef = useRef<HTMLDivElement>(null);

  // Abrir/cerrar filtro
  const handleOpenFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFilterOpen((prev) => !prev);
  };

  const handleFilter = (type: "All" | "Seen" | "Captured") => {
    setFilterType(type);
    setIsFilterOpen(false);
    setPage(1);
  };

  // Click fuera para cerrar filtro
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isFilterOpen]);

  // Ajustar items por pantalla
  useEffect(() => {
    const handleResize = () => {
      const height = window.innerHeight;
      setItemsPerPage(height > 1000 ? 7 : 5);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // IDs completos 1..151
  const allIds = useMemo(() => Array.from({ length: totalPokemon }, (_, i) => i + 1), []);

  // Filtrado
  const filteredIds = useMemo(() => {
    if (!user) return allIds;

    return allIds.filter((id) => {
      const poke = user.pokedex[id];
      const variantKey = isShinyList ? "shiny" : "normal";

      // Si no hay datos del poke
      if (!poke?.variants[variantKey]) {
        return filterType === "All"; // solo mostramos en "All"
      }

      const variant = poke.variants[variantKey];
      switch (filterType) {
        case "Captured":
          return (variant?.obtained ?? 0) > 0;
        case "Seen":
          return (variant?.seen ?? 0)  > 0 && (variant?.obtained ?? 0) === 0;
        case "All":
        default:
          return true;
      }
    });
  }, [user, isShinyList, filterType, allIds]);

  // Pagination
  const totalPages = useMemo(
    () => Math.ceil(filteredIds.length / itemsPerPage),
    [filteredIds.length, itemsPerPage]
  );

  const pageIds = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredIds.slice(start, start + itemsPerPage);
  }, [filteredIds, page, itemsPerPage]);

  // Nuevo Pokémon enfocado
  useEffect(() => {
    if (newPokemonRender?.id) {
      const newPage = Math.ceil(newPokemonRender.id / itemsPerPage);
      setPage(newPage);
      setIsShinyList(newPokemonRender.isShiny);
      setNewPokemonRender(null);
      setFilterType("All")
    }
  }, [newPokemonRender, itemsPerPage]);

  return (
    <div className="relative z-10 h-[100%] w-full bg-white rounded-[15px] border-[7px] border-black/10 flex flex-col justify-between items-center p-3 my-2">
      <div className="bg-red-300 rounded-[30px] shadow-[3.5px_3.5px_0px_rgba(0,0,0,0.25)] px-8 py-1 m-2">
        <span className="text-3xl text-white">Pokedex</span>
      </div>

      {/* HEADER */}
      <div className="w-full flex items-center justify-between">
        <div className="w-[20%] flex flex-col justify-start text-[0.5rem]"></div>
        <div className="w-[60%] flex space-x-2 justify-center">
          <span>Normal</span>
          <Switch
            onChange={() => { setIsShinyList(!isShinyList); setPage(1); }}
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
        <div className="w-[20%] flex justify-end">
          <img
            src={Filter}
            alt="Sort"
            className={`botones h-9 w-9 p-1 transition-all duration-100 ${isFilterOpen ? "active" : ""}`}
            onClick={handleOpenFilter}
          />
          {isFilterOpen && (
            <div
              ref={sortRef}
              className="absolute right-15 bg-white border border-gray-200 shadow-lg rounded-xl w-32 p-2 text-sm animate-fadeIn z-2"
            >
              {["All", "Seen", "Captured"].map((type) => (
                <div
                  key={type}
                  onClick={() => handleFilter(type as any)}
                  className={`cursor-pointer px-3 py-1 rounded-md mb-1 text-center ${
                    filterType === type
                      ? "bg-red-300 text-white font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {type}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* LIST */}
      <div className="w-full flex justify-center">
        <PokeList isShinyList={isShinyList} listIds={pageIds} />
      </div>

      {/* PAGINATION */}
      <div className="w-full">
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>
    </div>
  );
};

export default Pokedex;
