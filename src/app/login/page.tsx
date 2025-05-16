"use client";

import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { loginUser } from "@/app/api/auth";
import { useRouter } from "next/navigation";

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
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Erro ao fazer login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-center mb-4 text-black">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded text-black"
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded text-black"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition-colors cursor-pointer"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <a
          href="/register"
          className="text-center text-blue-600 text-sm mt-2 hover:underline"
        >
          Não tem uma conta? Cadastre-se
        </a>
      </form>
    </main>
  );
}
