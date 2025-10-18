import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import type { UserData } from "../models/UserData";
type PokeRender = {
  id: number,
  isShiny: boolean
}
type UserContextType = {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  loading: boolean;
  renderPokedex: boolean;
  setRenderPokedex: (render: boolean) => void;
  newPokemonRender: PokeRender | null;
  setNewPokemonRender: (poke: PokeRender | null) => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  renderPokedex: false,
  setRenderPokedex: () => {},
  newPokemonRender: null,
  setNewPokemonRender: () => {},

});

export const useUser = () => useContext(UserContext);

type Props = { children: ReactNode };

export const UserProvider = ({ children }: Props) => {
const API_URL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState<UserData | null>(null);
  const [renderPokedex, setRenderPokedex] = useState<boolean>(false)
  const [newPokemonRender, setNewPokemonRender] = useState<PokeRender | null>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true); 
      let id: string | null = null;

      if (currentUser) {
        id = currentUser.uid;
      } else {
        const guestSession = sessionStorage.getItem("guestSession");
        if (guestSession) {
          id = localStorage.getItem("guestId");
        }
      }

      if (!id) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/users/${id}`);
        if (!res.ok) {
          console.warn("Usuario no encontrado en backend:", id);
          setUser(null);
          setLoading(false);
          return;
        }

        const data: UserData = await res.json();
        if (!data) throw new Error("Usuario no encontrado en la BD.");

        setUser(data);
      } catch (err) {
        console.error("Error al traer usuario de backend:", err);
        setUser(null);
        if(currentUser) signOut(auth)
          
      } finally {
        setLoading(false); 
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, renderPokedex, setRenderPokedex, newPokemonRender, setNewPokemonRender }}>
      {children}
    </UserContext.Provider>
  );
};
