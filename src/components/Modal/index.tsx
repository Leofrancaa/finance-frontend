// components/Modal.tsx
"use client";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-white/30">
      {/* O conteúdo (como ExpenseForm) deve conter seu próprio layout e botão de fechar */}
      <div className="w-full max-w-3xl">{children}</div>
    </div>
  );
};
