"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [emailRecuperacao, setEmailRecuperacao] = useState("");
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  // Login normal
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem("");
    // Implemente sua lógica de login aqui
    // Exemplo:
    // const res = await fetch("/api/auth/login", { ... });
    setTimeout(() => {
      setLoading(false);
      setMensagem("Login de exemplo realizado (implemente sua lógica)");
    }, 1000);
  };

  // Envia código para o e-mail
  const handleEnviarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem("");
    const res = await fetch("/api/auth/enviar_codigo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailRecuperacao }),
    });
    if (res.ok) {
      setCodigoEnviado(true);
      setMensagem("Código enviado para seu e-mail.");
    } else {
      setMensagem("E-mail não encontrado.");
    }
    setLoading(false);
  };

  // Troca a senha usando o código
  const handleTrocarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem("");
    const res = await fetch("/api/auth/trocar_senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailRecuperacao,
        codigo,
        novaSenha,
      }),
    });
    if (res.ok) {
      setMensagem("Senha alterada com sucesso! Faça login.");
      setShowForgot(false);
      setCodigoEnviado(false);
      setCodigo("");
      setNovaSenha("");
      setEmailRecuperacao("");
    } else {
      const data = await res.json();
      setMensagem(data.error || "Erro ao trocar senha.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Entrar</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            name="senha"
            placeholder="Senha"
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <div className="text-right mb-2">
            <button
              type="button"
              className="text-blue-400 text-sm underline"
              onClick={() => setShowForgot(true)}
            >
              Esqueci minha senha
            </button>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="bg-gray-600 text-white px-4 py-2 rounded w-full hover:bg-gray-700 transition-colors"
            >
              Voltar
            </button>
          </div>
        </form>

        {/* Link para cadastro */}
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm">
            Não tem login ainda?{' '}
            <button
              onClick={() => router.push('/cliente')}
              className="text-orange-400 hover:text-orange-300 underline font-semibold"
            >
              Cadastrar
            </button>
          </p>
        </div>

        {mensagem && <p className="mt-4 text-center text-sm text-orange-300">{mensagem}</p>}
      </div>

      {/* Modal de recuperação de senha */}
      <Dialog open={showForgot} onOpenChange={setShowForgot}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Recuperar senha</DialogTitle>
          </DialogHeader>
          {!codigoEnviado ? (
            <form onSubmit={handleEnviarCodigo} className="space-y-4">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="w-full p-2 rounded bg-gray-700"
                value={emailRecuperacao}
                onChange={(e) => setEmailRecuperacao(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-orange-500 py-2 rounded text-white font-bold"
                disabled={loading}>
                {loading ? "Enviando..." : "Enviar código"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleTrocarSenha} className="space-y-4">
              <input
                type="text"
                placeholder="Código de 5 dígitos"
                className="w-full p-2 rounded bg-gray-700"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
                maxLength={5}
              />
              <input
                type="password"
                placeholder="Nova senha"
                className="w-full p-2 rounded bg-gray-700"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-orange-500 py-2 rounded text-white font-bold"
                disabled={loading}>
                {loading ? "Trocando..." : "Trocar senha"}
              </button>
            </form>
          )}
          <button className="mt-2 text-orange-400 underline" onClick={() => setShowForgot(false)}>
            Cancelar
          </button>
          {mensagem && <p className="mt-4 text-center text-sm text-orange-300">{mensagem}</p>}
        </DialogContent>
      </Dialog>
    </div>
  );
}
