"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { AlertThresholdProvider } from "@/contexts/AlertThresholdContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { CreditCardProvider } from "@/contexts/CreditCardContext";
import { useFetchExpenses } from "@/hooks/useFetchExpenses";
import { useFetchIncomes } from "@/hooks/usefetchIncomes";
import ExpensesCard from "../components/ExpensesCard";
import IncomesCard from "../components/IncomesCard";
import CryptoInvestmentCard from "../components/CryptoInvestmentCard";
import BalanceCard from "../components/BalanceCard";

export default function HomePage() {
  const { user } = useUser();
  const router = useRouter();

  useFetchExpenses();
  useFetchIncomes();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <AlertThresholdProvider>
      <CreditCardProvider>
        <CategoryProvider>
          <div className="w-full overflow-x-hidden bg-gray-50 text-black py-6 px-4 md:px-10 flex flex-col items-center gap-6 min-h-screen">
            <div className="flex flex-col self-start mb-2 lg:mb-4">
              <h1 className="text-xl lg:text-4xl font-extrabold mt-12 lg:mt-2">
                Dashboard
              </h1>
              <span className="text-sm text-gray-600">
                Visão geral das suas finanças
              </span>
            </div>

            {/* Cards responsivos */}
            <div className="grid grid-cols-1 lg:flex lg:justify-center md:justify-between w-full gap-6">
              <ExpensesCard />
              <IncomesCard />
              <BalanceCard />
              <CryptoInvestmentCard totalInvestido={0} percentChange={0} />
            </div>
          </div>
        </CategoryProvider>
      </CreditCardProvider>
    </AlertThresholdProvider>
  );
}
