// components/Modal.tsx
"use client";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/30 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-gray-600 hover:text-black text-3xl cursor-pointer"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};
