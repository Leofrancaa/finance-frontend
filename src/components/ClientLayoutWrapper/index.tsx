"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/SideBar";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideSidebar = ["/login", "/register", "/inicio", "/planos"].includes(
    pathname
  );

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {!hideSidebar && <Sidebar />}
      <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
    </div>
  );
}
