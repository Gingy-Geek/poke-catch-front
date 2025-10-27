import specialPB from "../../../assets/specialPB.png";
import normalPB from "../../../assets/normalPB.png";

const Searching = ({ loadingMessage }: { loadingMessage: string }) => {
  return (
    <>
      <div className="flex justify-center items-center flex-1">
        <div className="flex items-center space-x-5 h-50">
          <img
            src={normalPB}
            className="w-25 h-25 animate-bounce"
            style={{ animationDelay: "0s", animationFillMode: "both" }}
          />
          <img
            src={specialPB}
            className="w-25 h-25 animate-bounce"
            style={{ animationDelay: "0.2s", animationFillMode: "both" }}
          />
          <img
            src={normalPB}
            className="w-25 h-25 animate-bounce hidden md:block"
            style={{ animationDelay: "0.4s", animationFillMode: "both" }}
          />
        </div>
      </div>
      <div className=" bg-white border-[10px] border-double border-black/70 text-center py-5">
        <span className="animate-pulse" style={{ animationDuration: "0.7s" }}>
          {loadingMessage}
        </span>
      </div>
    </>
  );
};

export default Searching;
