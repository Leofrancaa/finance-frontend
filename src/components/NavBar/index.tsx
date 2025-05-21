"use client";

import { useRouter } from "next/navigation";
import Sidebar from "../SideBar";
import UserInfoAndBalance from "../UserInfo";
import { useUser } from "@/contexts/UserContext";
import { usePathname } from "next/navigation";
import Logo from "@/assets/logo.png";
import Image from "next/image";
import Link from "next/link";
import LogoutButton from "../LogoutButton";

export default function NavBar() {
  const { logout } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // Esconde a NavBar em páginas de autenticação
  const isAuthPage = pathname === "/login" || pathname === "/registro";

  if (isAuthPage) return null;

  const handleLogout = () => {
    logout(); // <- sua função de logout
    router.push("/login");
  };

  return (
    <header className="w-full bg-gray-200 shadow-sm flex items-center justify-between px-4 py-6 fixed top-0 left-0 z-40">
      {/* Botão de menu (aparece sempre, o Sidebar lida com abertura/fechamento) */}
      <Sidebar />

      {/* Espaço central para título ou deixar vazio */}
      <Link href={"/"} className="flex-1 ml-20">
        <Image src={Logo} alt={""} width={130}></Image>
      </Link>

      {/* Informações e botão de logout */}
      <div className="flex items-center gap-8">
        <UserInfoAndBalance />

        <LogoutButton onClick={handleLogout} />
      </div>
    </header>
  );
}
