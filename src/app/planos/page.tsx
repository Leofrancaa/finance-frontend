import React from "react";
import { CheckCircle, Star } from "lucide-react";

const plans = [
  {
    name: "Básico",
    price: "Grátis",
    features: [
      "Controle de despesas básico",
      "Categorização simples",
      "Relatórios mensais",
      "Até 2 cartões de crédito",
      "Suporte por email",
    ],
    button: "Começar Grátis",
    highlight: false,
  },
  {
    name: "Premium",
    price: "R$ 29.9",
    subtitle: "/mês",
    features: [
      "Controle completo de finanças",
      "Categorias personalizadas",
      "Relatórios avançados",
      "Cartões ilimitados",
      "Metas financeiras",
      "Sincronização bancária",
      "Suporte prioritário",
      "Backup automático",
    ],
    button: "Assinar Agora",
    highlight: true,
  },
  {
    name: "Empresarial",
    price: "R$ 99.9",
    subtitle: "/mês",
    features: [
      "Todas as funcionalidades Premium",
      "Gestão multi-empresa",
      "Relatórios personalizados",
      "API para integração",
      "Suporte 24/7",
      "Treinamento especializado",
      "Consultoria financeira",
      "Compliance avançado",
    ],
    button: "Assinar Agora",
    highlight: false,
  },
];

export default function PlansPage() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 py-16 px-6 flex flex-col items-center">
      <h1 className="text-5xl font-bold mb-6 text-center">Escolha seu Plano</h1>
      <p className="text-center text-xl text-gray-600 mb-12 max-w-2xl">
        Encontre o plano perfeito para gerenciar suas finanças e alcançar seus
        objetivos
      </p>

      <div className="flex flex-wrap justify-center gap-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl shadow-sm border p-8 w-[400px] flex flex-col items-center relative ${
              plan.highlight ? "border-blue-600 shadow-md " : "border-gray-200"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                <Star className="w-4 h-4 fill-blue-600 text-blue-100" /> Mais
                Popular
              </div>
            )}
            <h2 className="text-2xl font-semibold mb-1">{plan.name}</h2>
            <p className="text-blue-600 text-4xl font-bold mb-1">
              {plan.price}
            </p>
            {plan.subtitle && (
              <span className="text-sm text-gray-500 mb-4">
                {plan.subtitle}
              </span>
            )}
            <ul className="text-base text-left space-y-3 mb-6 w-full">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-3 rounded-md font-semibold transition text-white ${
                plan.highlight
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-900 hover:bg-gray-800"
              }`}
            >
              {plan.button}
            </button>
          </div>
        ))}
      </div>

      <section className="mt-20 w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-8">
          Perguntas Frequentes
        </h2>
        <div className="space-y-6">
          <FAQ
            question="Posso mudar de plano a qualquer momento?"
            answer="Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As alterações entram em vigor no próximo ciclo de cobrança."
          />
          <FAQ
            question="O plano grátis tem limitações?"
            answer="O plano básico inclui funcionalidades essenciais para controle financeiro pessoal, mas com algumas limitações como número de cartões e recursos avançados."
          />
          <FAQ
            question="Como funciona o suporte?"
            answer="Oferecemos suporte por email para todos os planos. Usuários Premium e Empresarial têm acesso a suporte prioritário e chat ao vivo."
          />
          <FAQ
            question="Meus dados estão seguros?"
            answer="Absolutely! Utilizamos criptografia de ponta e seguimos as melhores práticas de segurança para proteger seus dados financeiros."
          />
        </div>
      </section>

      <div className="mt-20 w-[90%] max-w-7xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-12 rounded-xl">
        <h2 className="text-2xl font-bold mb-3">
          Pronto para transformar suas finanças?
        </h2>
        <p className="text-lg font-light mb-6">
          Junte-se a milhares de usuários que já assumiram o controle de sua
          vida financeira.
        </p>
        <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-md hover:bg-blue-100 transition cursor-pointer">
          Começar Agora
        </button>
      </div>
    </div>
  );
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-3 text-lg">{question}</h3>
      <p className="text-gray-600 text-base leading-relaxed">{answer}</p>
    </div>
  );
}
