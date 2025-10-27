import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import CloseIcon from "@mui/icons-material/Close";
import avatars from "../../../utils/avatars";
import { motion, AnimatePresence } from "framer-motion";

type UserPodium = {
  displayName: string;
  avatar: number;
  obtained: number;
  seen: number;
};

type PodiumModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ITEMS_PER_PAGE = 5;
const ITEM_HEIGHT = 60; // altura fija por ítem

const PodiumModal: React.FC<PodiumModalProps> = ({ isOpen, onClose }) => {
  const [users, setUsers] = useState<UserPodium[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPageUsers, setNextPageUsers] = useState<UserPodium[]>([]);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchPodium = async (pageNum: number) => {
    try {
      const res = await fetch(
        `${API_URL}/api/users/podium?page=${pageNum}&perPage=${ITEMS_PER_PAGE}`
      );
      if (!res.ok) throw new Error("Error fetching podium");
      const data = await res.json();
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } 
  };

  const preloadNextPage = async (nextPageNum: number) => {
    if (nextPageNum > totalPages) return;
    try {
      const res = await fetch(
        `${API_URL}/api/users/podium?page=${nextPageNum}&perPage=${ITEMS_PER_PAGE}`
      );
      if (!res.ok) return;
      const data = await res.json();
      setNextPageUsers(data.users);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPodium(page);
      preloadNextPage(page + 1);
    }
  }, [isOpen, page]);

  const handleNext = () => {
    if (page < totalPages) {
      // reemplazamos inmediatamente con los datos precargados
      setUsers(nextPageUsers);
      setPage((prev) => prev + 1);
      // precargamos la siguiente
      preloadNextPage(page + 2);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      appElement={document.getElementById("root")!}
      className="bg-[#D9D9D9] rounded-xl p-6 w-[90%] md:w-[70%] xl:w-[45%] text-center outline-none relative"
      overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <button
        className="botones absolute right-[3%] top-[3%] flex"
        onClick={onClose}
      >
        <CloseIcon fontSize="small" />
      </button>

      <div className="bg-red-300 rounded-[30px] shadow-[3.5px_3.5px_0px_rgba(0,0,0,0.25)] px-6 py-2 mb-6 inline-block">
        <span className="text-3xl text-white font-bold">Leaderboard</span>
      </div>

      {/* LISTADO */}
      <motion.div
        className="flex flex-col justify-start gap-3"
        style={{ minHeight: ITEMS_PER_PAGE * ITEM_HEIGHT }}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-2"
          >
            {users.map((user, i) => {
              // Calcular ranking absoluto
              const rank = (page - 1) * ITEMS_PER_PAGE + i + 1;

              // Definir colores según el ranking absoluto
              let bgColor = "bg-white";
              let numberColor = "text-gray-700";

              if (rank === 1) {
                bgColor = "bg-yellow-200"; // oro
                numberColor = "text-yellow-500 font-bold";
              } else if (rank === 2) {
                bgColor = "bg-gray-200"; // plata
                numberColor = "text-gray-500 font-bold";
              } else if (rank === 3) {
                bgColor = "bg-orange-200"; // bronce
                numberColor = "text-orange-500 font-bold";
              }

              return (
                <div
                  key={user.displayName}
                  style={{ height: ITEM_HEIGHT }}
                  className={`flex items-center justify-between p-3 ${bgColor} rounded-xl shadow hover:shadow-lg transition-shadow duration-200`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-semibold ${numberColor}`}>
                      {rank}.
                    </span>
                    <img
                      src={avatars[user.avatar]}
                      alt={user.displayName}
                      className="w-8 h-8 md:w-12 md:h-12 rounded-full border border-gray-200"
                    />
                    <span className="text-gray-800 text-sm md:text-base">
                      {user.displayName}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 md:flex-row md:gap-4 items-end">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs md:text-sm">
                      <span className="inline md:hidden">Capt:</span>
                      <span className="hidden md:inline">Captured:</span>{" "}
                      {user.obtained}
                    </span>
                    <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs md:text-sm">
                      <span className="inline md:hidden">Seen:</span>
                      <span className="hidden md:inline">Seen:</span>{" "}
                      {user.seen}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Filas vacías */}
            {Array.from({ length: ITEMS_PER_PAGE - users.length }).map(
              (_, i) => (
                <div key={`empty-${i}`} style={{ height: ITEM_HEIGHT }} />
              )
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="flex justify-between items-center mt-4">
        <button
          className="botones px-3 py-1 disabled:opacity-50"
          onClick={handlePrev}
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="font-medium">
          Page {page} / {totalPages}
        </span>
        <button
          className="botones px-3 py-1 disabled:opacity-50"
          onClick={handleNext}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </Modal>
  );
};

export default PodiumModal;
