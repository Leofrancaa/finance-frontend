import React from "react";
import { ShieldCheck, Smartphone, BarChart2, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-900 flex flex-col items-center justify-center py-12 px-4">
      <h1 className="text-[80px] font-bold text-center text-blue-600 mb-4">
        NEXUS
      </h1>
      <p className="text-center text-2xl max-w-3xl mb-8 text-gray-600">
        Transforme a forma como você gerencia suas finanças pessoais. Controle
        total, insights inteligentes e planejamento estratégico.
      </p>
      <div className="flex gap-4 mb-12">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition cursor-pointer">
          Ver Planos
        </button>
        <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded-md font-medium hover:bg-blue-100 transition cursor-pointer">
          Começar Grátis
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 w-full max-w-[75vw] mb-12 gap-12">
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

      <div className="bg-blue-600 text-white text-center px-8 py-12 rounded-xl w-[75vw] mt-6">
        <h2 className="text-3xl font-bold mb-4">
          Pronto para assumir o controle das suas finanças?
        </h2>
        <p className="mb-8 text-xl font-light">
          Junte-se a milhares de usuários que já transformaram sua vida
          financeira com o Nexus.
        </p>
        <Link href={"/planos"}>
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
    <div className="bg-white hover:shadow-lg duration-300 transition rounded-lg shadow-sm flex flex-col items-center justify-center text-center w-[17vw] h-[12vw] px-4">
      <div className="flex justify-center mb-6">
        <div className="bg-blue-50 text-blue-600 rounded-full p-3 flex items-center justify-center w-12 h-12">
          {icon}
        </div>
      </div>
      <h3 className="font-semibold text-lg mb-6 text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
