import { useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import "../../css/button.css";
import "../../css/cards.css";
import { useUser } from "../../context/userContext";
import Edit from "../../assets/pencil.png";
import Podium from "../../assets/podium.png";
import Modal from "react-modal";
import avatars from "../../utils/avatars";
import CloseIcon from "@mui/icons-material/Close";
import PodiumModal from "./Modals/PodiumModal";

const UserInfo = ({ logout }: { logout: () => void }) => {
  const { user, setUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenUser, setIsOpenUser] = useState(false);
  const [isPodiumOpen, setIsPodiumOpen] = useState(false); 
  const API_URL = import.meta.env.VITE_API_URL;

  if (!user) {
    console.error("User not found");
    return;
  }
  const oldAvatar = user.avatar;

  const handleLogOut = () => {
    setIsOpen(true);
  };

  const handleUserProfile = () => {
    setIsOpenUser(true);
  };

  const handleCloseUserProfile = async () => {
    setIsOpenUser(false);

    try {
      const res = await fetch(`${API_URL}/api/users/changeAvatar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          avatar: user.avatar, // solo el valor final
        }),
      });

      if (!res.ok) {
        setUser({ ...user, avatar: oldAvatar });
        console.error("Error al guardar avatar en servidor", res.status);
      }
    } catch (err) {
      setUser({ ...user, avatar: oldAvatar });
      console.error("Error de red al guardar avatar:", err);
    }
  };

  const changeAvatar = (newAvatar: number) => {
    setUser({ ...user, avatar: newAvatar });
  };

  return (
    <div
      className="h-[30%] mb-2 p-3 bg-[#D9D9D9]"
      style={{
        borderRadius: "0px 0px 15px 15px",
        width: "100%",
      }}
    >
      <div className="mt-5 w-full flex text-3xl">
        <span className="card w-full text-gray-400 bg-white flex items-center py-[5px] px-[10px]">
          <div className="relative w-10 h-10 mr-2" onClick={handleUserProfile}>
            {/* Avatar con borde */}
            <img
              src={avatars[user.avatar]}
              alt="profile"
              className="w-10 h-10 object-cover "
              style={{ cursor: "pointer" }}
            />

            {/* Ícono de lápiz superpuesto */}
            <img
              src={Edit}
              alt="Editar"
              className="absolute bottom-[-3px] right-[-3px] w-4 h-4 bg-white rounded-full border border-gray-300 p-[2px] cursor-pointer"
            />
          </div>
          <span className="text-lg md:text-3xl">{user.displayName}</span>
        </span>

        <button
          onClick={handleLogOut}
          className="botones ml-[-20px] px-[3px] py-[3px]"
        >
          <LogoutIcon className="" fontSize="large" />
        </button>
        <img
          src={Podium}
          alt="Podium"
          onClick={() => setIsPodiumOpen(true)}
          className="botones ml-[10px] md:ml-[20px] px-[6px] py-[6px] w-13 h-13"
        />
      </div>
      <div className="card mt-3 w-full xl:w-[60%] lg:flex flex-col justify-between items-start py-[5px] px-[10px] ">
        <div className="flex w-full justify-between items-center">
          <h3 className="text-lg md:text-xl text-gray-400">Rolls remaining:</h3>
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-300 text-black text-lg font-bold">
            {user.dailyCatches}
          </span>
        </div>
        <div className="flex w-full justify-between items-center">
          <h3 className="text-lg md:text-xl text-gray-400">
            Masterball remaining:
          </h3>
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-300 text-black text-lg font-bold">
            {user.masterBalls}
          </span>
        </div>
      </div>

      {/* Logout */}
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        appElement={document.getElementById("root")!}
        className="bg-white rounded-xl shadow-lg p-6 w-[90%] md:w-[40%] text-center outline-none"
        overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Are you sure you want to log out?
        </h2>

        <div className="flex justify-center gap-4">
          <button onClick={logout} className="botones p-2 m-2 w-[60px]">
            Yes
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="botones p-2 m-2 w-[60px]"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* UserProfile */}
      <Modal
        isOpen={isOpenUser}
        onRequestClose={handleCloseUserProfile}
        appElement={document.getElementById("root")!}
        className="bg-[#D9D9D9] rounded-xl p-6 w-[90%] md:w-[60%] lg:w-[35%] text-center outline-none relative"
        overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        {/* Botón cerrar (opcional) */}
        <button
          className="botones absolute right-[3%] top-[3%] flex"
          onClick={handleCloseUserProfile}
        >
          <CloseIcon className="m-0 p-0" fontSize="small" />
        </button>

        {/* Título principal */}
        <h2 className="text-3xl font-semibold text-gray-700 mb-6">Profile</h2>

        {/* Avatar principal + nombre */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <div>
            <img
              src={avatars[user.avatar]}
              alt="Avatar seleccionado"
              className="w-20 h-20 rounded-full object-cover border-4 border-gray-600 shadow-md"
            />
          </div>
          <div className="card px-3 py-1 text-gray-500 text-lg font-medium">
            {user.displayName}
          </div>
        </div>

        {/* Subtítulo */}
        <h3 className="text-sm md:text-xl uppercase tracking-widest text-gray-600 mb-2">
          Choose Your Avatar
        </h3>

        {/* Grid de avatares */}
        <div className="card p-3 grid grid-cols-4 gap-3 justify-items-center h-[120px] overflow-y-auto mb-6">
          {avatars.map((src, i) => {
            const isSelected = user.avatar === i;

            return (
              <div
                key={i}
                onClick={() => changeAvatar(i)}
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

        {/* Pokédex Progress */}
        <h3 className="text-sm md:text-xl uppercase tracking-widest text-gray-600 mb-2">
          Pokedex Progress
        </h3>
        <div className="card text-gray-600 rounded-xl p-4 flex justify-around">
          <div className="text-center">
            <span className="block text-sm text-gray-500">Captured</span>
            <span className="block text-xl font-bold text-black-500">
              {user.obtained}
            </span>
          </div>
          <div className="text-center">
            <span className="block text-sm text-gray-500">Seen</span>
            <span className="block text-xl font-bold text-black-500">
              {user.seen}
            </span>
          </div>
        </div>
      </Modal>

      {/* Leaderboard */}
      <PodiumModal
        isOpen={isPodiumOpen}
        onClose={() => setIsPodiumOpen(false)}
      />
    </div>
  );
};

export default UserInfo;
