import { ReactSVG } from "react-svg";
import Arrow from "../../assets/pokedexArrow.svg";

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
    svg.setAttribute("fill", "#fb6767ff");
    svg.setAttribute("width", "100");
    svg.setAttribute("height", "auto");
    svg.style.cursor = "pointer";
    svg.style.transition = "transform 0.1s, fill 0.2s";

    svg.addEventListener("mouseenter", () => svg.setAttribute("fill", "#ff0000"));
    svg.addEventListener("mouseleave", () => {
      svg.setAttribute("fill", "#fb6767ff");
      svg.style.transform = "scale(1)";
    });
    svg.addEventListener("mousedown", () => svg.style.transform = "scale(0.9)");
    svg.addEventListener("mouseup", () => svg.style.transform = "scale(1)");
    svg.addEventListener("touchstart", () => svg.style.transform = "scale(0.9)", { passive: true });
    svg.addEventListener("touchend", () => svg.style.transform = "scale(1)", { passive: true });
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
