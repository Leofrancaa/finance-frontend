"use client";

import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  onClick: () => void;
}

export default function LogoutButton({ onClick }: LogoutButtonProps) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer group flex items-center w-[45px] h-[45px] bg-red-600 text-white rounded-md shadow-md overflow-hidden transition-all duration-300 hover:w-[120px] active:translate-x-[2px] active:translate-y-[2px]"
    >
      {/* Ícone */}
      <div className="flex items-center justify-center w-[45px] h-full">
        <LogOut size={18} className="text-white" />
      </div>

      {/* Texto */}
      <span className="ml-2 whitespace-nowrap text-sm font-medium opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto transition-all duration-300">
        Sair
      </span>
    </button>
  );
}
