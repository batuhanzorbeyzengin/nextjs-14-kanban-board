import React, { useState } from "react";
import { SketchPicker } from "react-color";
import { Button } from "@/components/Button";
import * as Yup from "yup";
import { useFormik } from "formik";

interface AddCardModalProps {
  onClose: () => void;
  onSubmit: (title: string, color: string) => void;
}

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  color: Yup.string().required("Color is required"),
});

const AddCardModal: React.FC<AddCardModalProps> = ({ onClose, onSubmit }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const formik = useFormik({
    initialValues: {
      title: "",
      color: "#ffffff",
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values.title, values.color);
      formik.resetForm();
      onClose();
    },
  });

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-xl font-medium">Add New Card</h2>
        <form onSubmit={formik.handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="title"
            className="w-full mb-4 p-2 border rounded"
          />
          {formik.touched.title && formik.errors.title ? (
            <div className="text-red-500">{formik.errors.title}</div>
          ) : null}

          <div className="mb-4">
            <Button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="mb-2"
            >
              Pick Color
            </Button>
            {showColorPicker && (
              <SketchPicker
                color={formik.values.color}
                onChangeComplete={(color) => formik.setFieldValue("color", color.hex)}
              />
            )}
          </div>
          {formik.touched.color && formik.errors.color ? (
            <div className="text-red-500">{formik.errors.color}</div>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formik.isValid || formik.isSubmitting}>
              Add
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCardModal;
