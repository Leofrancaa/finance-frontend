"use client";

import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { loginUser } from "@/app/api/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/assets/white-logo.png";

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
    <main className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="mb-8">
        <Image src={Logo} alt={""} width={200} height={100}></Image>
      </div>
      <div className="login-box inverted">
        <p>Login</p>
        <form onSubmit={handleSubmit}>
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
            {loading ? "Entrando..." : "ENTRAR"}
          </button>
        </form>
        <p className="mt-6 text-gray-700">
          Não tem uma conta?{" "}
          <a href="/register" className="a2 inverted">
            Cadastre-se!
          </a>
        </p>
      </div>
    </main>
  );
}
