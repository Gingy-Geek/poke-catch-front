import { useState, useRef, useEffect } from "react";
import Question from "../../assets/question.png";

const InfoBubble = () => {
  const [open, setOpen] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        bubbleRef.current &&
        !bubbleRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="botones absolute z-1 top-[3%] right-[3%] p-1"
      ref={bubbleRef}
      onClick={() => setOpen(!open)}
    >
      <img src={Question} alt="" className="h-5 w-5" />

      {/* Burbuja */}
      {open && (
        <div
          className="absolute top-full right-0 mt-2 w-75 md:w-80 bg-white rounded-lg p-4 shadow-lg z-20"
          style={{ border: "solid 4px #0000001c" }}
        >
          <p className="text-sm md:text-lg mb-2 text-center text-black">
            Catch & Spawn Info
          </p>
          <hr className="my-2 border-black/20" />

          <p className="text-xs md:text-base mb-2">
            <span className="text-black">Spawn chances:</span>
            <br />
            <span style={{ color: "#CBD5E1" }}>Common:</span> 80% &nbsp;|&nbsp;
            <span style={{ color: "#e360fa" }}>Rare:</span> 18% &nbsp;|&nbsp;
            <span style={{ color: "#FBBF24" }}>Legendary:</span> 2%
          </p>

          <p className="text-xs md:text-base mb-2">
            <span className="text-black">Base catch chances:</span>
            <br />
            <span style={{ color: "#CBD5E1" }}>Common:</span> 70% &nbsp;|&nbsp;
            <span style={{ color: "#e360fa" }}>Rare:</span> 40% &nbsp;|&nbsp;
            <span style={{ color: "#FBBF24" }}>Legendary:</span> 10%
          </p>

          <p className="text-xs md:text-base mb-2">
            <span className="text-black">Shiny Pokémon chance:</span> 15%
          </p>

          <hr className="my-2 border-black/20" />

          <p className="text-xs md:text-base text-gray-600 mt-2">
            Using a Masterball adds +30% to the catch chance
          </p>
          <hr className="my-2 border-black/20" />

          <p className="text-xs md:text-base mb-2">
            <span className="text-black">Catches per day:</span> 5
          </p>
          <p className="text-xs md:text-base mb-2">
            <span className="text-black">Additional Masterballs per day:</span> 2
          </p>
        </div>
      )}
    </div>
  );
};

export default InfoBubble;
