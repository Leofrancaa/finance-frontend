import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ExpensesProvider } from "@/contexts/ExpensesContext";
import { DateProvider } from "@/contexts/DateContext";
import { IncomesProvider } from "@/contexts/IncomesContext";
import { UserProvider } from "@/contexts/UserContext";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper"; // novo

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Gerenciador de Finanças",
  description: "Controle seus gastos de forma simples e visual",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="antialiased bg-gray-100 min-h-screen">
        <UserProvider>
          <DateProvider>
            <ExpensesProvider>
              <IncomesProvider>
                <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
              </IncomesProvider>
            </ExpensesProvider>
          </DateProvider>
        </UserProvider>
      </body>
    </html>
  );
}
