import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Card as CardType } from "@/context/BoardContext";
import CardComponent from "./Card";

interface SectionProps {
  section: {
    id: string;
    name: string;
    order: number;
  };
  cards: CardType[];
}

const Section: React.FC<SectionProps> = ({ section, cards }) => {
  return (
    <Droppable droppableId={section.id}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-[#262626] text-white m-2 p-4 rounded-lg max-w-xs w-full box-border"
        >
          <h3 className="text-[37px] font-bold mb-2">{section.name}</h3>
          {cards
            .filter((card) => card.section.id === section.id)
            .sort((a, b) => a.order - b.order)
            .map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <CardComponent card={card} />
                  </div>
                )}
              </Draggable>
            ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Section;
