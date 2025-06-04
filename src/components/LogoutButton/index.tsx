"use client";

import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  onClick: () => void;
}

export default function LogoutButton({ onClick }: LogoutButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 rounded-md  text-red-600 hover:bg-red-100 transition cursor-pointer"
    >
      <LogOut size={22} className="text-red-600" />
      <span className="text-lg font-medium">Sair</span>
    </button>
  );
}
