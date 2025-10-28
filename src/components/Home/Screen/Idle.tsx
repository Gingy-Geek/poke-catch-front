import questionMark from "../../../assets/question.png";
import playIcon from "../../../assets/playIcon.png";
import type { UserData } from "../../../models/UserData";
import { useEffect, useState } from "react";

const Idle = ({ play, user, setUser }: { play: () => void; user: UserData | null; setUser: (user:UserData | null) => void }) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user?.rollResetAt) return;

    let hasReset = false; // variable local para evitar múltiples llamadas

    const interval = setInterval(async () => {
      if (!user?.rollResetAt) {
        setTimeLeft(null);
        clearInterval(interval);
        return;
      }

      const diff = user.rollResetAt - Date.now();
      setTimeLeft(diff > 0 ? diff : 0);

      if (diff <= 0 && !hasReset) {
        hasReset = true;
        clearInterval(interval);
        console.log("TERMINO, llamando al backend...");

        try {
          const res = await fetch(
            `${API_URL}/api/users/${user.uid}/resetRolls`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            }
          );

          const data = await res.json();

          if (!res.ok) {
            console.error("Error al resetear tiradas:", data.error);
            return; // no hacemos setUser
          }

          setUser(data); // solo si todo salió bien
        } catch (err) {
          console.error("Error al resetear tiradas:", err);
        }
      }
    }, 1000);

    // Ejecutamos inmediatamente para no esperar 1s
    const diffInitial = user.rollResetAt - Date.now();
    setTimeLeft(diffInitial > 0 ? diffInitial : 0);
    if (diffInitial <= 0 && !hasReset) {
      hasReset = true;
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [user?.rollResetAt]);

  // Formatea ms a hh:mm:ss
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // Mensaje que se muestra
  const getMessage = () => {
    if (user?.dailyCatches && user.dailyCatches > 0) return "Let’s catch!";
    if (timeLeft !== null && timeLeft > 0)
      return `Out of catches! Rolls reset in ${formatTime(timeLeft)}`;
  };

  const isDisabled = user?.dailyCatches === 0 && (timeLeft ?? 0) > 0;

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <div className="flex justify-center items-center flex-1">
        <img
          src={questionMark}
          alt="pokemon"
          className="w-50 h-50 object-contain"
        />
      </div>
      <div className="bg-white border-[10px] border-double border-black/70 text-center py-5">
        <div>
          <span className="text-base lg:text-lg">{getMessage()}</span>
          <br />
          <div
            style={{ display: "flex", justifyContent: "center" }}
            className="mt-[15px]"
          >
            <button
              disabled={isDisabled}
              onClick={() => {
                if (!isDisabled) play();
              }}
              className={`playButton flex items-center text-3xl px-2 ${
                isDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              PLAY <img src={playIcon} alt="" className="ml-5 w-5 opacity-30" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Idle;
