"use client";

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
} from "lucide-react";
import LogoutButton from "../LogoutButton";
import UserInfoAndBalance from "../UserInfo";
import { useUser } from "../../contexts/UserContext";

export default function Sidebar() {
  const router = useRouter();
  const { logout } = useUser();

  const handleLogout = () => {
    logout(); // <- sua função de logout
    router.push("/login");
  };

  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path
      ? "bg-blue-50 text-blue-700 font-semibold"
      : "text-gray-700";

  return (
    <aside className="w-[14vw] h-full bg-white border-r shadow-md flex flex-col px-6 py-8 shrink-0">
      <div className="flex flex-col gap-0 border-b-1 border-gray-200">
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
          href="/inicial"
          className={`flex items-center gap-3 px-4 py-3 rounded-md hover:bg-blue-50 transition ${isActive(
            "/inicio"
          )}`}
        >
          <Home className="w-6 h-6" />
          Início
        </Link>

        <Link
          href="/"
          className={`flex items-center gap-3 px-4 py-3 rounded-md hover:bg-blue-50 transition ${isActive(
            "/"
          )}`}
        >
          <LayoutDashboard className="w-6 h-6" />
          Dashboard
        </Link>

        <Link
          href="/receitas"
          className={`flex items-center gap-3 px-4 py-3 rounded-md hover:bg-blue-50 transition ${isActive(
            "/receitas"
          )}`}
        >
          <DollarSign className="w-6 h-6" />
          Receitas
        </Link>

        <Link
          href="/despesas"
          className={`flex items-center gap-3 px-4 py-3 rounded-md hover:bg-blue-50 transition ${isActive(
            "/despesas"
          )}`}
        >
          <ArrowDownCircle className="w-6 h-6" />
          Despesas
        </Link>

        <Link
          href="/investimentos"
          className={`flex items-center gap-3 px-4 py-3 rounded-md hover:bg-blue-50 transition ${isActive(
            "/investimentos"
          )}`}
        >
          <LineChart className="w-6 h-6" />
          Investimentos
        </Link>

        <Link
          href="/cartoes"
          className={`flex items-center gap-3 px-4 py-3 rounded-md hover:bg-blue-50 transition ${isActive(
            "/cartoes"
          )}`}
        >
          <CreditCard className="w-6 h-6" />
          Cartões
        </Link>

        <Link
          href="/categorias"
          className={`flex items-center gap-3 px-4 py-3 rounded-md hover:bg-blue-50 transition ${isActive(
            "/categorias"
          )}`}
        >
          <FolderKanban className="w-6 h-6" />
          Categorias
        </Link>

        <Link
          href="/planos"
          className={`flex items-center gap-3 px-4 py-3 rounded-md hover:bg-blue-50 transition ${isActive(
            "/planos"
          )}`}
        >
          <Gem className="w-6 h-6" />
          Planos
        </Link>

        <div className="mt-6">
          <LogoutButton onClick={handleLogout} />
        </div>
      </nav>
    </aside>
  );
}
