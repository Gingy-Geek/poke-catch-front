import React, { useEffect, useState } from "react";
import { useUser } from "../context/userContext";

export const Test = () => {
  const { user } = useUser();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!user?.rollResetAt) return;

    const updateTime = () => {
      if (!user?.rollResetAt) {
        setTimeLeft(null);
        return;
      }
      const now = Date.now();
      const diff = user.rollResetAt - now;
      setTimeLeft(diff > 0 ? diff : 0);
    };

    updateTime(); // inicial
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [user?.rollResetAt]);

  // Función para formatear ms a hh:mm:ss
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

  if (!user) return <div>No user</div>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Roll Reset Test</h2>
      {user.rollResetAt ? (
        <div>
          {timeLeft! > 0 ? (
            <p>Time left until rolls reset: {formatTime(timeLeft!)}</p>
          ) : (
            <p>Rolls are ready! 🎉</p>
          )}
        </div>
      ) : (
        <p>No roll reset active</p>
      )}
    </div>
  );
};
