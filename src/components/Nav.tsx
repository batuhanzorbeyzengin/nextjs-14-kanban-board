"use client";

import { useState } from "react";
import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { useBoard } from "@/context/BoardContext";
import CreateBoardModal from "@/components/CreateBoardModal";

const Nav = () => {
  const { boards, addBoard } = useBoard();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          {boards.map((board) => (
            <Link
              key={board.id}
              className="group flex items-center justify-between rounded-lg p-2 hover:bg-gray-200"
              href={`/dashboard/board/${board.id}`}
            >
              <span className="flex items-center gap-2">
                <ChevronRight size={16} />
                <span className="font-medium">{board.name}</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          <button
            className="group flex items-center justify-between rounded-lg p-2 hover:bg-gray-200"
            onClick={() => setIsPopupOpen(true)}
          >
            <span className="flex items-center gap-2">
              <Plus size={16} />
              <span className="font-medium">Create Board</span>
            </span>
          </button>
        </div>
      </div>

      <CreateBoardModal
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onCreate={addBoard}
      />
    </>
  );
};

export default Nav;
