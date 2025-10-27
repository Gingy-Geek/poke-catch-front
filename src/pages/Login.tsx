import { useEffect } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "../context/userContext";
import { motion } from "framer-motion";
import GoogleIcon from "@mui/icons-material/Google";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";

export default function Login() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const saveUserToBackend = async (uid: string, displayName: string) => {
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, displayName }),
      });
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Error guardando usuario en backend:", err);
    }
  };

  const loginGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const currentUser = result.user;
      const name = currentUser.displayName ?? "Entrenador desconocido";
      await saveUserToBackend(currentUser.uid, name);
      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };

  const loginGuest = async () => {
    let guestUuid = localStorage.getItem("guestId");
    if (!guestUuid) {
      guestUuid = uuidv4();
      localStorage.setItem("guestId", guestUuid);
    }

    const digits = guestUuid.replace(/\D/g, "").slice(0, 4);
    const displayName = `#Guest${digits}`;
    sessionStorage.setItem("guestSession", "true");

    await saveUserToBackend(guestUuid, displayName);
    navigate("/home");
  };

  useEffect(() => {
    if (user) navigate("/home");
  }, [user]);

  return (
  <div className="flex flex-col items-center justify-center min-h-screen">
    {/* Card */}
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="bg-[#f8f8f8] shadow-[5px_5px_0px_rgba(0,0,0,0.25)] rounded-2xl p-8 w-[90%] sm:w-[400px] text-center border-4 border-[#ff5c5c]"
    >
      <div className="flex flex-col items-center gap-2 mb-6">
        <CatchingPokemonIcon
          sx={{ fontSize: 60, color: "#ff5c5c" }}
          className="drop-shadow-[3px_3px_0_rgba(0,0,0,0.25)]"
        />
        <h1 className="text-4xl font-bold text-gray-700 drop-shadow-[2px_2px_0_rgba(0,0,0,0.2)]">
          Pokécatch Login
        </h1>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <motion.button
          style={{cursor:'pointer'}}
          onClick={loginGoogle}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 bg-[#fff] border-2 border-[#ff5c5c] hover:bg-[#ffeaea] text-gray-700 font-semibold py-2 rounded-xl shadow-[3px_3px_0_rgba(0,0,0,0.25)] transition"
        >
          <GoogleIcon /> Sign in with Google
        </motion.button>

        <motion.button
          style={{cursor:'pointer'}}
          onClick={loginGuest}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 bg-[#ff5c5c] text-white font-semibold py-2 rounded-xl hover:bg-[#ff3232] shadow-[3px_3px_0_rgba(0,0,0,0.25)] transition"
        >
          <CatchingPokemonIcon /> Continue as Guest
        </motion.button>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        Catch ‘em all and climb the leaderboard! 🏆
      </p>
    </motion.div>
  </div>
);

}
