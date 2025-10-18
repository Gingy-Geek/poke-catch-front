import { useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import avatar from "../../assets/avatars/10.png";
import "../../css/button.css";
import "../../css/cards.css";
import { useUser } from "../../context/userContext";
import Modal from "react-modal";

const UserInfo = ({logout}: {logout: ()=> void}) => {
  const [isOpen, setIsOpen] = useState(false);

   const handleLogOut = () => {
    setIsOpen(true);
  };

  const {user} = useUser()
  if(!user) {
    console.error("User not found")
    return
  }
  
  return (
    <div
      className="h-[30%] mb-2 p-3 bg-[#D9D9D9]"
      style={{
        borderRadius: "0px 0px 15px 15px",
        width: "100%",
      }}
    >
      <div className="mt-5 w-full md:w-3/4 flex text-3xl">
        <span className="card w-full text-gray-400 bg-white flex items-center py-[5px] px-[10px]">
          <img
            src={avatar}
            alt="profile"
            className="w-8 h-8 object-cover mr-2"
          />
          {user.displayName}
        </span>
        <button onClick={handleLogOut} className="botones ml-[-25px] px-[3px] py-[3px]">
          <LogoutIcon className="" fontSize="large" />
        </button>
      </div>
      <div className="card mt-3 lg:flex flex-col justify-between items-start py-[5px] px-[10px] ">
        <div className="flex w-full md:w-3/4 xl:w-1/2 justify-between items-center">
          <h3 className="text-lg md:text-xl text-gray-400">Catch remaining:</h3>
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-300 text-black text-lg font-bold">
            {user.dailyCatches}
          </span>
        </div>
        <div className="flex w-full md:w-3/4 xl:w-1/2 justify-between items-center">
          <h3 className="text-lg md:text-xl text-gray-400">Masterball remaining:</h3>
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-300 text-black text-lg font-bold">
            {user.masterBalls}
          </span>
        </div>
      </div>

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
          <button
            onClick={logout}
            className="botones p-2 m-2 w-[60px]"
          >
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
    </div>
  );
};

export default UserInfo;
