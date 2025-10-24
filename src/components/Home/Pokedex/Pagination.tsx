import { ReactSVG } from "react-svg";
import Arrow from "../../../assets/pokedexArrow.svg";

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export const Pagination = ({ page, totalPages, setPage }: PaginationProps) => {
  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const configureSVG = (svg: SVGSVGElement) => {
    // Fill y tamaño inicial
    svg.setAttribute("fill", "#fb6767ff");
    svg.setAttribute("width", "100");
    svg.setAttribute("height", "auto");
    svg.style.cursor = "pointer";
    svg.style.transition = "transform 0.1s, fill 0.2s, filter 0.2s";

    // Shadow inicial estilo pixelado
    svg.style.filter = "drop-shadow(3.5px 3.5px 0px rgba(0,0,0,0.25))";

    // Hover
    svg.addEventListener("mouseenter", () => {
      svg.setAttribute("fill", "#ff0000");
    });
    svg.addEventListener("mouseleave", () => {
      svg.setAttribute("fill", "#fb6767ff");
      svg.style.transform = "scale(1)";
      svg.style.filter = "drop-shadow(3.5px 3.5px 0px rgba(0,0,0,0.25))";
    });

    // Presionar / click
    const pressDown = () => {
      svg.style.transform = "scale(0.9)";
      svg.style.filter = "drop-shadow(1.5px 1.5px 0px rgba(0,0,0,0.25))";
    };
    const release = () => {
      svg.style.transform = "scale(1)";
      svg.style.filter = "drop-shadow(3.5px 3.5px 0px rgba(0,0,0,0.25))";
    };

    svg.addEventListener("mousedown", pressDown);
    svg.addEventListener("mouseup", release);
    svg.addEventListener("touchstart", pressDown, { passive: true });
    svg.addEventListener("touchend", release, { passive: true });
  };

  return (
    <div className="flex w-full justify-around my-[-15px]">
      <ReactSVG
        src={Arrow}
        beforeInjection={(svg) => configureSVG(svg)}
        onClick={handlePrev}
      />

      <ReactSVG
        src={Arrow}
        beforeInjection={(svg) => configureSVG(svg)}
        className="transform scale-x-[-1]"
        onClick={handleNext}
      />
    </div>
  );
};
