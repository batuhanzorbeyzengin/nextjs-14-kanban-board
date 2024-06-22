import React from "react";
import { Card as CardType } from "@/context/BoardContext";

interface CardProps {
  card: CardType;
}

const CardComponent: React.FC<CardProps> = ({ card }) => {
  return (
    <div className="p-4 mb-2 rounded-lg text-white" style={{ backgroundColor: card.color }}>
      <h4 className="text-xs font-semibold">{card.title}</h4>
    </div>
  );
};

export default CardComponent;
