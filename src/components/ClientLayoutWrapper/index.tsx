"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/NavBar";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/login" || pathname === "/register";

  return (
    <div className="flex">
      {!hideSidebar && <NavBar />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
