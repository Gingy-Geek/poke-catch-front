import { useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "../context/userContext";
import { motion, AnimatePresence } from "framer-motion";
import GoogleIcon from "@mui/icons-material/Google";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";
import "../css/button.css";
import avatars from "../utils/avatars";

export default function Login() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [wakingServerMsg, setWakingServerMsg] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [avatar, setAvatar] = useState(0);
  const [tempUID, setTempUID] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const saveUserToBackend = async (uid: string,displayName: string,avatar: number) => {
    try {
      setLoading(true);
      setWakingServerMsg(false);

      // Muestra el mensaje del servidor después de 2 segundos
      const msgTimer = setTimeout(() => setWakingServerMsg(true), 2000);

      const res = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, displayName, avatar }),
      });
      const data = await res.json();
      if (!res.ok) {
        // El backend devolvió 400, 500, etc.
        console.error("Error del backend:", data.error || data.message);
        alert("Back error: " + (data.error || data.message))
        setWakingServerMsg(true);
        return;
      }
      setUser(data);

      clearTimeout(msgTimer);
    } catch (err) {
      console.error("Error saving user to backend:", err);
    } finally {
      setLoading(false);
      setWakingServerMsg(false);
    }
  };

  const loginGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const currentUser = result.user;
      const name = currentUser.displayName ?? "Unknown Trainer";

      setTempUID(currentUser.uid);

      setLoading(true);
      setWakingServerMsg(false);

      const res = await fetch(`${API_URL}/api/users/${currentUser.uid}`);

      if (res.status === 404) {
        // Usuario nuevo de Google
        setDisplayName(name);
        setShowProfileModal(true);
      } else if (!res.ok) {
        console.error("Error fetching user:", res.status, res.statusText);
        throw new Error("fetching user" + res.status +" "+ res.statusText)
      } else {
        const data = await res.json();
        // Validar que data exista
        if (!data) {
          console.error("User data is empty");
          setWakingServerMsg(true);
          return;
        }
        setUser(data);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Error: " + error)
      setWakingServerMsg(true);
    } finally {
      if (!showProfileModal) {
        setLoading(false);
      }
    }
  };

  const saveProfileAndProceed = async () => {
    if (displayName.trim().length < 3) {
      setErrorMsg(
        "Nickname cannot be empty and must have at least 3 characters"
      );
      return;
    }
    setErrorMsg("");
    if (!tempUID) return;

    await saveUserToBackend(tempUID, displayName, avatar);
    setShowProfileModal(false);
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

    await saveUserToBackend(guestUuid, displayName, 0);
  };

  const cancelLoading = async () => {
    setLoading(false);
    await logout();
  };
  const cancelNewUser = async () => {
    setShowProfileModal(false);
    setDisplayName("");
    setAvatar(0);
    setTempUID("");
    await logout();
  };
  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      console.log("Guest logout");
    }

    sessionStorage.removeItem("guestSession");
    setUser(null);
  };

  useEffect(() => {
    if (user && !loading) {
      navigate("/home");
    }
  }, [user, loading]);

  useEffect(() => {
    let msgTimer: ReturnType<typeof setTimeout>;
    let cancelTimer: ReturnType<typeof setTimeout>;

    if (loading) {
      msgTimer = setTimeout(() => setWakingServerMsg(true), 2000);
      cancelTimer = setTimeout(() => setShowCancel(true), 10000);
    } else {
      setWakingServerMsg(false);
      setShowCancel(false);
    }

    return () => {
      clearTimeout(msgTimer);
      clearTimeout(cancelTimer);
    };
  }, [loading]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {showProfileModal && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#f0f0f0] rounded-2xl p-6 w-[90%] md:w-[60%] lg:w-[35%] text-center border-4 border-[#9E9E9E] shadow-[5px_5px_0px_rgba(0,0,0,0.25)]"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            {/* Título */}
            <h2 className="text-2xl font-bold mb-2 text-gray-700 drop-shadow-[2px_2px_0_rgba(0,0,0,0.2)]">
              Set up your profile
            </h2>
            <hr />
            <h3 className="text-sm md:text-base uppercase tracking-widest text-gray-600 my-2">
              Enter a Nickname
            </h3>

            {/* Nickname */}
            <input
              type="text"
              placeholder="Nickname"
              className="card p-2 w-full mb-4 focus:outline-none focus:ring-2! focus:ring-blue-300! "
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            {/* Mensaje de error */}
            {errorMsg && (
              <p className="text-red-500 text-sm mb-2">{errorMsg}</p>
            )}

            {/* Avatar grid */}
            <h3 className="text-sm md:text-base uppercase tracking-widest text-gray-600 mb-2">
              Choose Your Avatar
            </h3>
            <div className="card p-3 grid grid-cols-4 gap-3 justify-items-center h-[120px] overflow-y-auto mb-6">
              {avatars.map((src, i) => {
                const isSelected = avatar === i;

                return (
                  <div
                    key={i}
                    onClick={() => setAvatar(i)}
                    className={`
        w-12 h-12 rounded-full overflow-hidden cursor-pointer transition-all duration-200
        border-2 ${
          isSelected
            ? "border-blue-500 scale-105"
            : "border-transparent hover:border-blue-500 hover:scale-105"
        }
      `}
                  >
                    <img
                      src={src}
                      alt={`Avatar ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}
            </div>

            {/* Botones */}
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelNewUser}
                className="botones !bg-red-100 px-4 py-2 shadow-[3px_3px_0px_rgba(0,0,0,0.25)]"
              >
                Cancel
              </button>
              <button
                onClick={saveProfileAndProceed}
                className="botones !bg-green-100 px-4 py-2 shadow-[3px_3px_0px_rgba(0,0,0,0.25)]"
              >
                Save & Continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* === Loading Modal === */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="bg-white rounded-2xl p-8 shadow-xl text-center border-4 border-[#ff5c5c] w-[85%] sm:w-[350px]"
            >
              {/* Título principal */}
              <p className="text-xl font-semibold text-gray-700 mb-2 flex justify-center items-center gap-1">
                Loading
                {/* 🔹 Animación de tres puntitos */}
                <motion.span
                  className="inline-flex gap-[2px]"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
                  >
                    .
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
                  >
                    .
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
                  >
                    .
                  </motion.span>
                </motion.span>
              </p>

              {/* Mensaje de servidor */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: wakingServerMsg ? 1 : 0 }}
                transition={{ duration: 0.8 }}
              >
                {wakingServerMsg && (
                  <p className="text-sm text-gray-500 mt-1">
                    Waking up the server, this might take a moment ☕
                  </p>
                )}
              </motion.div>

              {/* 🔹 Botón de cancelar luego de 10 segundos */}
              {showCancel && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ transform: "none" }} // 🔹 libera el transform para que funcione el :active del CSS
                  className="mt-5"
                >
                  <button onClick={cancelLoading} className="botones px-4 py-2">
                    Cancel
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === Card === */}
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
            style={{ cursor: "pointer" }}
            onClick={loginGoogle}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 bg-[#fff] border-2 border-[#ff5c5c] hover:bg-[#ffeaea] text-gray-700 font-semibold py-2 rounded-xl shadow-[3px_3px_0_rgba(0,0,0,0.25)] transition"
          >
            <GoogleIcon /> Sign in with Google
          </motion.button>

          <motion.button
            style={{ cursor: "pointer" }}
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
