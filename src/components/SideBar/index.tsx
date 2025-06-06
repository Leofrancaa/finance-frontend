"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  DollarSign,
  ArrowDownCircle,
  LineChart,
  CreditCard,
  FolderKanban,
  Gem,
  Home,
  Menu,
  X,
} from "lucide-react";
import LogoutButton from "../LogoutButton";
import UserInfoAndBalance from "../UserInfo";
import { useUser } from "@/contexts/UserContext";

export default function Sidebar() {
  const router = useRouter();
  const { logout } = useUser();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (path: string) =>
    pathname === path
      ? "bg-blue-50 text-blue-700 font-semibold"
      : "text-gray-700";

  return (
    <>
      {/* HEADER NO MOBILE - desaparece com menu aberto */}
      {!isOpen && (
        <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="bg-white rounded-md p-1"
            >
              <Menu className="w-6 h-6 text-blue-600" />
            </button>
            <h1 className="text-xl font-extrabold text-blue-600 tracking-tight">
              NEXUS
            </h1>
          </div>
        </header>
      )}

      {/* MENU LATERAL */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full bg-white border-r shadow-md px-6 py-8 flex flex-col w-[250px] transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:w-[17vw] lg::w-[14vw] md:shrink-0`}
      >
        {/* CABEÇALHO MOBILE DENTRO DO MENU */}
        <div className="flex justify-between items-center md:hidden mb-4">
          <h1 className="text-2xl font-extrabold text-blue-600">NEXUS</h1>
          <button onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* CABEÇALHO DESKTOP */}
        <div className="hidden md:block border-b border-gray-200">
          <h1 className="text-[27px] font-extrabold text-blue-600 tracking-tight uppercase">
            Nexus
          </h1>
          <h2 className="text-gray-600 text-sm font-light mb-6">
            Finanças Pessoais
          </h2>
        </div>

        <UserInfoAndBalance />

        <nav className="flex flex-col gap-2 mt-6 text-lg">
          <Link
            href="/inicio"
            className={`flex items-center gap-3 px-4 py-3 rounded-md hover:bg-blue-50 transition ${isActive(
              "/inicio"
            )}`}
            onClick={() => setIsOpen(false)}
          >
            <Home className="w-6 h-6" />
            Início
          </Link>

          <Link
            href="/"
            className={`flex items-center gap-3 px-4 py-3 rounded-md hover:bg-blue-50 transition ${isActive(
              "/"
            )}`}
            onClick={() => setIsOpen(false)}
          >
            <LayoutDashboard className="w-6 h-6" />
            Dashboard
          </Link>

          <Link
            href="/receitas"
            className={`flex items-center gap-3 px-4 py-3 rounded-md hover:bg-blue-50 transition ${isActive(
              "/receitas"
            )}`}
            onClick={() => setIsOpen(false)}
          >
            <DollarSign className="w-6 h-6" />
            Receitas
          </Link>

          <Link
            href="/despesas"
            className={`flex items-center gap-3 px-4 py-3 rounded-md hover:bg-blue-50 transition ${isActive(
              "/despesas"
            )}`}
            onClick={() => setIsOpen(false)}
          >
            <ArrowDownCircle className="w-6 h-6" />
            Despesas
          </Link>

          <Link
            href="/investimentos"
            className={`flex items-center gap-3 px-4 py-3 rounded-md hover:bg-blue-50 transition ${isActive(
              "/investimentos"
            )}`}
            onClick={() => setIsOpen(false)}
          >
            <LineChart className="w-6 h-6" />
            Investimentos
          </Link>

          <Link
            href="/cartoes"
            className={`flex items-center gap-3 px-4 py-3 rounded-md hover:bg-blue-50 transition ${isActive(
              "/cartoes"
            )}`}
            onClick={() => setIsOpen(false)}
          >
            <CreditCard className="w-6 h-6" />
            Cartões
          </Link>

          <Link
            href="/categorias"
            className={`flex items-center gap-3 px-4 py-3 rounded-md hover:bg-blue-50 transition ${isActive(
              "/categorias"
            )}`}
            onClick={() => setIsOpen(false)}
          >
            <FolderKanban className="w-6 h-6" />
            Categorias
          </Link>

          <Link
            href="/planos"
            className={`flex items-center gap-3 px-4 py-3 rounded-md hover:bg-blue-50 transition ${isActive(
              "/planos"
            )}`}
            onClick={() => setIsOpen(false)}
          >
            <Gem className="w-6 h-6" />
            Planos
          </Link>

          <div className="mt-6">
            <LogoutButton
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
            />
          </div>
        </nav>
      </aside>
    </>
  );
}
