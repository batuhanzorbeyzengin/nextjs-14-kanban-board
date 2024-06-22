import { useState } from "react";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import Modal from "@/components/Modal";

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
}

const CreateBoardModal: React.FC<CreateBoardModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [boardName, setBoardName] = useState("");

  const handleCreate = async () => {
    if (boardName.trim() === "") return;
    await onCreate(boardName);
    setBoardName("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg w-full">
      <h2 className="mb-4 text-xl font-medium">Create New Board</h2>
      <Input
        type="text"
        placeholder="Board name"
        value={boardName}
        onChange={(e) => setBoardName(e.target.value)}
        className="mb-4"
      />
      <div className="flex justify-end gap-2">
        <Button onClick={onClose} className="bg-gray-500 text-white hover:bg-gray-600">Cancel</Button>
        <Button onClick={handleCreate} className="bg-blue-500 text-white hover:bg-blue-600">Create</Button>
      </div>
    </Modal>
  );
};

export default CreateBoardModal;
