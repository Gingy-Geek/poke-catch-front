import questionMark from "../../../assets/question.png";
import playIcon from "../../../assets/playIcon.png";
import type { UserData } from "../../../models/UserData";
import { useEffect, useRef, useState } from "react";

const Idle = ({
  play,
  user,
  setUser,
}: {
  play: () => void;
  user: UserData | null;
  setUser: (user: UserData | null) => void;
}) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isResetting, setIsResetting] = useState<boolean>(
    !!user?.rollResetAt && user.rollResetAt <= Date.now()
  );
  const API_URL = import.meta.env.VITE_API_URL;
  const hasReset = useRef<boolean>(false);



  useEffect(() => {
    if (!user || !user.rollResetAt) return;
    if (hasReset.current) return; // ya llamamos al backend
 

    const resetBackend = async () => {
      if (hasReset.current) return;
      hasReset.current = true;
      setIsResetting(true);
      
      const startTime = Date.now();
      try {
        const res = await fetch(
          `${API_URL}/api/users/${user!.uid}/resetRolls`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          console.error("Error al resetear tiradas:", data.error);
          setIsResetting(false);
          return;
        }

        // aseguramos mínimo delay de 1.5s
        const elapsed = Date.now() - startTime;
        const minDelay = 1500;
        if (elapsed < minDelay) {
          await new Promise((resolve) =>
            setTimeout(resolve, minDelay - elapsed)
          );
        }

        setUser(data); // actualizamos estado del usuario
      } catch (err) {
        console.error("Error al resetear tiradas:", err);
      } finally {
        setIsResetting(false);
      }
    };

    const updateTime = () => {
      if (!user?.rollResetAt) return 0;
      const diff = user.rollResetAt - Date.now();
      setTimeLeft(diff > 0 ? diff : 0);
      return diff;
    };

    // Revisamos al montar
    const diffInitial = updateTime();
    if (diffInitial <= 0) {
      resetBackend();
      return; // no necesitamos setInterval
    }

    // Si no expiró, empezamos el contador
    const interval = setInterval(() => {
      const diff = updateTime();
      if (diff <= 0) {
        clearInterval(interval);
        resetBackend();
      }
    }, 1000);

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
    if (isResetting) return "Refilling Pokéballs…";
    if (user && user.dailyCatches > 0) return "Let’s catch!";
    if (timeLeft !== null && timeLeft > 0)
      return `Out of catches! Rolls reset in ${formatTime(timeLeft)}`;
    console.error("Something wronge happen")
    return "Error: restart the app";
  };

  const isDisabled =
    isResetting || (user?.dailyCatches === 0 && (timeLeft ?? 0) > 0);

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
