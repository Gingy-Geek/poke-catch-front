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

  const configureSVG = (svg: SVGSVGElement, flipShadow = false) => {
    svg.setAttribute("fill", "#fb6767ff");
    svg.setAttribute("width", "97");
    svg.setAttribute("height", "auto");
    svg.style.cursor = "pointer";
    svg.style.transition = "transform 0.1s, fill 0.2s, filter 0.2s";

    const shadowX = flipShadow ? -2.3 : 3.5;
    svg.style.filter = `drop-shadow(${shadowX}px 3.5px 0px rgba(0,0,0,0.25))`;

    // Hover
    svg.addEventListener("mouseenter", () => {
      svg.setAttribute("fill", "#ff0000");
    });
    svg.addEventListener("mouseleave", () => {
      svg.setAttribute("fill", "#fb6767ff");
      svg.style.transform = "scale(1)";
      svg.style.filter = `drop-shadow(${shadowX}px 3.5px 0px rgba(0,0,0,0.25))`;
    });

    // Presionar / click
    const pressDown = () => {
      svg.style.transform = "scale(0.9)";
      svg.style.filter = `drop-shadow(${
        shadowX / 2
      }px 1.5px 0px rgba(0,0,0,0.25))`;
    };
    const release = () => {
      svg.style.transform = "scale(1)";
      svg.style.filter = `drop-shadow(${shadowX}px 3.5px 0px rgba(0,0,0,0.25))`;
    };

    svg.addEventListener("mousedown", pressDown);
    svg.addEventListener("mouseup", release);
    svg.addEventListener("touchstart", pressDown, { passive: true });
    svg.addEventListener("touchend", release, { passive: true });
  };

  return (
    <div className="flex w-full justify-around items-center my-[-15px]">
      <ReactSVG
        src={Arrow}
        beforeInjection={(svg) => configureSVG(svg)}
        onClick={handlePrev}
      />
      <span className="text-2xl mx-[-3px] md:mx-0 md:text-3xl text-[#ffa2a2]">
        {page} / {totalPages}
      </span>

      <ReactSVG
        src={Arrow}
        beforeInjection={(svg) => configureSVG(svg, true)} // flipShadow=true
        className="transform scale-x-[-1]"
        onClick={handleNext}
      />
    </div>
  );
};
