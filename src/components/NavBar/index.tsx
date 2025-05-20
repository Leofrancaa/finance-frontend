"use client";

import { useRouter } from "next/navigation";
import Sidebar from "../SideBar";
import UserInfoAndBalance from "../UserInfo";
import { useUser } from "@/contexts/UserContext";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const { logout } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // Esconde a NavBar em páginas de autenticação
  const isAuthPage = pathname === "/login" || pathname === "/registro";

  if (isAuthPage) return null;

  return (
    <header className="w-full bg-white shadow-sm flex items-center justify-between px-4 py-6 fixed top-0 left-0 z-40">
      {/* Botão de menu (aparece sempre, o Sidebar lida com abertura/fechamento) */}
      <Sidebar />

      {/* Espaço central para título ou deixar vazio */}
      <div className="flex-1 ml-4">
        <h1 className="text-lg font-semibold text-gray-800 ml-12">
          Gerenciador de Finanças
        </h1>
      </div>

      {/* Informações e botão de logout */}
      <div className="flex items-center gap-4">
        <UserInfoAndBalance />
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="bg-red-600 text-white py-2 px-5 rounded hover:bg-red-700 text-sm"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
