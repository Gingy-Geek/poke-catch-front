import questionMark from "../../../assets/questionMark.png";
import playIcon from "../../../assets/playIcon.png";
import type { UserData } from "../../../models/UserData";

const Idle = ({ play, user }: { play: () => void; user: UserData | null}) => {
  return (
    <>
      <div className="flex justify-center items-center flex-1">
        <img
          src={questionMark}
          alt="pokemon"
          className="w-50 h-50 object-contain"
        />
      </div>
      <div className=" bg-white border-[10px] border-double border-black/70 text-center py-5">
        <div>
          <span className="text-base lg:text-lg">
            {user?.dailyCatches === 0
              ? "Out of catches! Come back tomorrow!"
              : "Let’s catch!"}
          </span>
          <br />
          <div
            style={{ display: "flex", justifyContent: "center" }}
            className="mt-[15px]"
          >
            <button
              disabled={user?.dailyCatches == 0}
              onClick={play}
              className="playButton flex items-center text-3xl px-2"
            >
              PLAY{" "}
              <img src={playIcon} alt="" className=" ml-5 w-5 opacity-30" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Idle;
