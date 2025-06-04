"use client";

import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { loginUser } from "@/app/api/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { token, user } = await loginUser(email, password);
      login(user, token);
      router.push("/");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-[24vw] rounded-lg shadow p-8">
        <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-6 uppercase ">
          nexus
        </h1>
        <h2 className="text-2xl font-bold text-center mb-1 text-gray-800">
          Entrar na sua conta
        </h2>
        <p className="text-center text-sm text-gray-500 mb-8">
          Acesse o painel de controle das suas finanças
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <div>
              <label className="text-sm text-gray-900 font-bold mb-2 block">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full border text-gray-700 border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-900 font-bold mb-2 block">
                Senha
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full border text-gray-700 border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-12 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-700">
          Não tem uma conta?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Criar conta
          </Link>
        </p>

        <div className="text-center mt-2">
          <Link
            href="/"
            className="text-sm text-blue-600 hover:underline inline-block"
          >
            ← Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}
