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
    <div className="flex h-screen w-screen overflow-hidden">
      {!hideSidebar && <Sidebar />}
      <div className="flex-1 overflow-y-auto bg-gray-50">{children}</div>
    </div>
  );
}
