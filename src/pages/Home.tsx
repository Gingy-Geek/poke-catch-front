// src/pages/Home.tsx
import { auth } from "../firebase";
import { signOut} from "firebase/auth";

import { Navigate, useNavigate } from "react-router-dom";
import ScreenGame from "../components/Home/ScreenGame";
import UserInfo from "../components/Home/UserInfo";
import Pokedex from "../components/Home/Pokedex";
import { useUser } from "../context/userContext";
import LoadingPokeball from "../components/LoadingPokeball";

export default function Home() {
  const { user, setUser, loading } = useUser();
  const navigate = useNavigate();

  
  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      console.log("Guest logout");
    }

    sessionStorage.removeItem("guestSession");
    setUser(null)
    navigate("/");
  };

  if (loading) return <LoadingPokeball />;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="tall flex flex-col md:flex-row items-center w-full h-[95vh] px-4">
        <div className="w-full h-[100%] md:w-1/2 flex flex-col justify-center items-center">
          <div className="w-full h-[100%] lg:w-3/4 relative">
            <ScreenGame />
            <div style={{position: 'absolute', background:'#d9d9d9', width:'100%', height:'45px', bottom:'26%', zIndex:'-1'}}></div>
            <UserInfo logout={logout}/>
          </div>
        </div>

        <div className="w-full h-[100%] md:w-1/2 flex flex-col justify-center items-center mt-5 md:mt-0">
          <div className="w-full h-[100%] lg:w-3/4">
            <Pokedex />
          </div>
        </div>
      </div>
    </div>
  );
}
