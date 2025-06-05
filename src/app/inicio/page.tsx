"use client";

import React from "react";
import { ShieldCheck, Smartphone, BarChart2, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-900 flex flex-col items-center justify-center py-12 px-4">
      <h1 className="text-5xl md:text-6xl lg:text-[80px] font-bold text-center text-blue-600 mb-4">
        NEXUS
      </h1>
      <p className="text-center text-lg md:text-xl lg:text-2xl max-w-3xl mb-8 text-gray-600">
        Transforme a forma como você gerencia suas finanças pessoais. Controle
        total, insights inteligentes e planejamento estratégico.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <Link href={"/planos"}>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition cursor-pointer">
            Ver Planos
          </button>
        </Link>
        <Link href={"/register"}>
          <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-100 transition cursor-pointer">
            Começar Grátis
          </button>
        </Link>
      </div>

      {/* Grid de features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl px-4 mb-12">
        <FeatureCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Controle Total"
          description="Gerencie suas receitas e despesas de forma simples e eficiente"
        />
        <FeatureCard
          icon={<ShieldCheck className="w-6 h-6" />}
          title="Seguro e Confiável"
          description="Seus dados financeiros protegidos com a melhor tecnologia"
        />
        <FeatureCard
          icon={<Smartphone className="w-6 h-6" />}
          title="Acesso em Qualquer Lugar"
          description="Interface responsiva para desktop, tablet e smartphone"
        />
        <FeatureCard
          icon={<BarChart2 className="w-6 h-6" />}
          title="Relatórios Inteligentes"
          description="Gráficos e análises para entender melhor seus gastos"
        />
      </div>

      {/* Call-to-action final */}
      <div className="bg-blue-600 text-white text-center px-6 py-12 rounded-xl w-full max-w-6xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Pronto para assumir o controle das suas finanças?
        </h2>
        <p className="mb-8 text-lg font-light">
          Junte-se a milhares de usuários que já transformaram sua vida
          financeira com o Nexus.
        </p>
        <Link href="/planos">
          <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-md hover:bg-blue-100 transition cursor-pointer">
            Escolher Plano
          </button>
        </Link>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white hover:shadow-lg transition duration-300 rounded-lg shadow-sm flex flex-col items-center justify-start text-center px-6 py-8 h-full">
      <div className="mb-4">
        <div className="bg-blue-50 text-blue-600 rounded-full p-3">{icon}</div>
      </div>
      <h3 className="font-semibold text-lg mb-2 text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
