"use client";

import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useParams } from "next/navigation";
import { useBoard } from "@/context/BoardContext";
import { debounce } from "lodash";
import Section from "@/components/board/Section";
import AddCardModal from "@/components/board/AddCardModal";
import { Button } from "@/components/Button";

export default function BoardDetails() {
  const { id } = useParams<{ id: string }>();
  const {
    sections,
    cards,
    fetchSections,
    fetchCards,
    updateCardOrder,
    updateCardSection,
    addCard,
    setCards,
  } = useBoard();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const debouncedFetchSections = debounce(fetchSections, 300);
    const debouncedFetchCards = debounce(fetchCards, 300);
    debouncedFetchSections();
    debouncedFetchCards(id);

    return () => {
      debouncedFetchSections.cancel();
      debouncedFetchCards.cancel();
    };
  }, [id, fetchSections, fetchCards]);

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceSectionId = source.droppableId;
    const destinationSectionId = destination.droppableId;

    if (sourceSectionId === destinationSectionId) {
      // Same section reordering
      const newCardOrder = Array.from(
        cards.filter((card) => card.section.id === sourceSectionId)
      );
      const [movedCard] = newCardOrder.splice(source.index, 1);
      newCardOrder.splice(destination.index, 0, movedCard);

      const updatedCards = cards.map((card) => {
        const newIndex = newCardOrder.findIndex((c) => c.id === card.id);
        if (newIndex !== -1) {
          return {
            ...card,
            order: newIndex + 1,
          };
        }
        return card;
      });

      setCards(updatedCards);

      try {
        await debounceUpdateCardOrder(
          updatedCards,
          sourceSectionId,
          destinationSectionId
        );
      } catch (error) {
        console.error("Error updating card order:", error);
      }
    } else {
      // Reordering between different sections
      const newSourceCardOrder = Array.from(
        cards.filter((card) => card.section.id === sourceSectionId)
      );
      const newDestinationCardOrder = Array.from(
        cards.filter((card) => card.section.id === destinationSectionId)
      );

      const [movedCard] = newSourceCardOrder.splice(source.index, 1);
      newDestinationCardOrder.splice(destination.index, 0, movedCard);

      const updatedCards = cards.map((card) => {
        if (card.id === movedCard.id) {
          return {
            ...card,
            section: {
              ...card.section,
              id: destinationSectionId,
            },
            order: destination.index + 1,
          };
        }
        if (card.section.id === sourceSectionId) {
          const newIndex = newSourceCardOrder.findIndex(
            (c) => c.id === card.id
          );
          if (newIndex !== -1) {
            return {
              ...card,
              order: newIndex + 1,
            };
          }
        }
        if (card.section.id === destinationSectionId) {
          const newIndex = newDestinationCardOrder.findIndex(
            (c) => c.id === card.id
          );
          if (newIndex !== -1) {
            return {
              ...card,
              order: newIndex + 1,
            };
          }
        }
        return card;
      });

      setCards(updatedCards);

      try {
        await debounceUpdateCardOrder(
          updatedCards,
          sourceSectionId,
          destinationSectionId
        );
        await updateCardSection(movedCard.id, destinationSectionId);
      } catch (error) {
        console.error("Error updating card order/section:", error);
      }
    }
  };

  const debounceUpdateCardOrder = debounce(
    async (updatedCards, sourceSectionId, destinationSectionId) => {
      await updateCardOrder(
        updatedCards,
        sourceSectionId,
        destinationSectionId
      );
    },
    300 // 300 ms debounce delay
  );

  const handleAddCard = async (title: string, color: string) => {
    const backlogSection = sections.find(
      (section) => section.name === "Backlog"
    );
    if (backlogSection) {
      await addCard(title, color, backlogSection.id, id);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Board Details</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Card</Button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-4">
          {sections.map((section) => (
            <Section key={section.id} section={section} cards={cards} />
          ))}
        </div>
      </DragDropContext>
      {isModalOpen && (
        <AddCardModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddCard}
        />
      )}
    </div>
  );
}
