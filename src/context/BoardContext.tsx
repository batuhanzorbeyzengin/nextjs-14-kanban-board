"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { sendRequest } from "@/utils/request";

// Board interfaces
interface Board {
  id: string;
  name: string;
  createdAt: string;
}

interface BoardContextProps {
  boards: Board[];
  addBoard: (name: string) => Promise<void>;
  fetchBoards: () => Promise<void>;
}

// Section and Card interfaces
export interface Section {
  id: string;
  name: string;
  order: number;
}

export interface Card {
  id: string;
  title: string;
  color: string;
  order: number;
  section: {
    id: string;
    name: string;
    order: number;
  };
}

interface BoardContextType extends BoardContextProps {
  sections: Section[];
  cards: Card[];
  fetchSections: () => Promise<void>;
  fetchCards: (boardId: string) => Promise<void>;
  updateCardOrder: (
    updatedCards: Card[],
    sourceSectionId: string,
    destinationSectionId: string
  ) => Promise<void>;
  updateCardSection: (cardId: string, newSectionId: string) => Promise<void>;
  addCard: (
    title: string,
    color: string,
    sectionId: string,
    boardId: string
  ) => Promise<void>;
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [cards, setCards] = useState<Card[]>([]);

  // Fetch boards
  const fetchBoards = async () => {
    try {
      const data = await sendRequest("/boards", "GET", undefined, true);
      setBoards(data);
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };

  const addBoard = async (name: string) => {
    try {
      await sendRequest("/boards", "POST", { name }, true);
      await fetchBoards();
    } catch (error) {
      console.error("Error adding board:", error);
    }
  };

  // Fetch sections
  const fetchSections = async () => {
    try {
      const data = await sendRequest("/card/section", "GET", undefined, true);
      const sortedSections = data.sort(
        (a: Section, b: Section) => a.order - b.order
      );
      setSections(sortedSections);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  // Fetch cards
  const fetchCards = async (boardId: string) => {
    try {
      const data = await sendRequest(
        `/card?boardId=${boardId}`,
        "GET",
        undefined,
        true
      );
      setCards(data);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  // Update card order
  const updateCardOrder = async (
    updatedCards: Card[],
    sourceSectionId: string,
    destinationSectionId: string
  ) => {
    try {
      await sendRequest(
        "/card/order",
        "POST",
        { cards: updatedCards, sectionId: sourceSectionId },
        true
      );
    } catch (error) {
      console.error("Error updating card order:", error);
    }
  };

  // Update card section
  const updateCardSection = async (cardId: string, newSectionId: string) => {
    try {
      await sendRequest(
        "/card/section",
        "POST",
        { cardId, newSectionId },
        true
      );
    } catch (error) {
      console.error("Error updating card section:", error);
    }
  };

  // Add card
  const addCard = async (
    title: string,
    color: string,
    sectionId: string,
    boardId: string
  ) => {
    try {
      await sendRequest(
        "/card",
        "POST",
        { title, color, sectionId, boardId },
        true
      );
      await fetchCards(boardId);
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <BoardContext.Provider
      value={{
        boards,
        addBoard,
        fetchBoards,
        sections,
        cards,
        fetchSections,
        fetchCards,
        updateCardOrder,
        updateCardSection,
        addCard,
        setCards,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = (): BoardContextType => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return context;
};
