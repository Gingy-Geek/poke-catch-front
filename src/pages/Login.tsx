import { useEffect } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "../context/userContext";

export default function Login() {
const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL);

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
      console.log(data);
      
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

      // traemos el usuario (el backend se encarga de crearlo si no existe)
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
      console.log(guestUuid);
      
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
    <div style={{ textAlign: "center" }}>
      <h1>Login</h1>
      <div>
        <button onClick={loginGoogle}>Login con Google</button>
        <button onClick={loginGuest} style={{ marginLeft: 10 }}>
          Entrar como Guest
        </button>
        
      </div>
    </div>
  );
}
