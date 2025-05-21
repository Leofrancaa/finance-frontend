"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Fecha automaticamente ao mudar de rota
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Botão de menu (sempre visível) */}
      <button
        onClick={toggleSidebar}
        className="fixed z-50 text-black p-2 rounded-md cursor-pointer"
      >
        {isOpen ? <X size={36} /> : <Menu size={36} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 flex flex-col gap-6 h-full border-r mt-12">
          <h2 className="text-xl font-bold text-gray-800">Navegação</h2>
          <nav className="flex flex-col gap-4">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
            <Link
              href="/receitas"
              className="text-gray-700 hover:text-blue-600"
            >
              Receitas
            </Link>
            <Link
              href="/despesas"
              className="text-gray-700 hover:text-blue-600"
            >
              Despesas
            </Link>
            <Link href="/cartoes" className="text-gray-700 hover:text-blue-600">
              Cartões
            </Link>
            <Link
              href="/categorias"
              className="text-gray-700 hover:text-blue-600"
            >
              Categorias
            </Link>
            <Link href="/alertas" className="text-gray-700 hover:text-blue-600">
              Alertas
            </Link>
          </nav>
        </div>
      </aside>
    </>
  );
}
