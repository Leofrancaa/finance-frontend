"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/assets/white-logo.png";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
        }/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao registrar.");
        return;
      }

      alert("Cadastro realizado com sucesso!");
      router.push("/login");
    } catch (err) {
      console.error(err);
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="mb-8">
        <Image src={Logo} alt={""} width={200} height={100}></Image>
      </div>
      <div className="login-box inverted">
        <p>Cadastro</p>

        {error && (
          <div className="bg-red-600 text-white p-2 rounded text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="user-box">
            <label className="text-black text-sm mb-1 block">Nome</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="user-box">
            <label className="text-black text-sm mb-1 block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="user-box">
            <label className="text-black text-sm mb-1 block">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-btn inverted">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            {loading ? "Cadastrando..." : "CADASTRAR"}
          </button>
        </form>

        <p className="mt-6">
          Já tem uma conta?{" "}
          <a href="/login" className="a2 inverted">
            Faça login
          </a>
        </p>
      </div>
    </main>
  );
}
