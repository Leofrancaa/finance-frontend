import "./globals.css";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ExpensesProvider } from "@/contexts/ExpensesContext";
import { DateProvider } from "@/contexts/DateContext";
import { IncomesProvider } from "@/contexts/IncomesContext";
import { UserProvider } from "@/contexts/UserContext";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import { InvestmentProvider } from "@/contexts/InvestmentContext";
import { AlertThresholdProvider } from "@/contexts/AlertThresholdContext";

// Fonte principal: Manrope
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexus",
  description: "Controle seus gastos de forma simples e visual",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${manrope.variable}`}>
      <body className="antialiased bg-gray-50 min-h-screen font-sans">
        <UserProvider>
          <DateProvider>
            <ExpensesProvider>
              <IncomesProvider>
                <InvestmentProvider>
                  <AlertThresholdProvider>
                    <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
                  </AlertThresholdProvider>
                </InvestmentProvider>
              </IncomesProvider>
            </ExpensesProvider>
          </DateProvider>
        </UserProvider>
      </body>
    </html>
  );
}
