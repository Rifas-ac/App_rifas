import React, { useState } from "react";

interface Props {
  onClose: () => void;
}

export default function EsqueciSenhaModal({ onClose }: Props) {
  const [step, setStep] = useState<"email" | "codigo" | "senha" | "sucesso">("email");
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  async function handleEnviarEmail(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    const res = await fetch("/api/auth/enviar_codigo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setStep("codigo");
    } else {
      setErro("E-mail não encontrado.");
    }
  }

  async function handleValidarCodigo(e: React.FormEvent) {
    e.preventDefault();
    setStep("senha");
  }

  async function handleTrocarSenha(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    const res = await fetch("/api/auth/trocar_senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, codigo, novaSenha }),
    });
    if (res.ok) {
      setStep("sucesso");
    } else {
      setErro("Código inválido ou erro ao trocar senha.");
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 shadow-2xl border border-gray-600 rounded-2xl p-8 w-full max-w-xs relative animate-fade-in">
        <button className="absolute top-2 right-4 text-gray-400 text-xl hover:text-white" onClick={onClose}>×</button>
        {step === "email" && (
          <form onSubmit={handleEnviarEmail} className="space-y-3">
            <h2 className="text-lg font-bold text-center mb-2 text-white">Recuperar senha</h2>
            <input
              type="email"
              placeholder="Informe seu e-mail"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            {erro && <div className="text-red-500 text-sm">{erro}</div>}
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-2 rounded font-bold shadow hover:from-blue-700 hover:to-blue-500 transition">
              Enviar código
            </button>
          </form>
        )}
        {step === "codigo" && (
          <form onSubmit={handleValidarCodigo} className="space-y-3">
            <h2 className="text-lg font-bold text-center mb-2 text-white">Insira o código enviado</h2>
            <input
              type="text"
              placeholder="4 dígitos"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              required
              maxLength={4}
            />
            {erro && <div className="text-red-500 text-sm">{erro}</div>}
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-2 rounded font-bold shadow hover:from-blue-700 hover:to-blue-500 transition">
              Confirmar código
            </button>
          </form>
        )}
        {step === "senha" && (
          <form onSubmit={handleTrocarSenha} className="space-y-3">
            <h2 className="text-lg font-bold text-center mb-2 text-white">Nova senha</h2>
            <input
              type="password"
              placeholder="Nova senha"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={novaSenha}
              onChange={e => setNovaSenha(e.target.value)}
              required
            />
            {erro && <div className="text-red-500 text-sm">{erro}</div>}
            <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-green-400 text-white py-2 rounded font-bold shadow hover:from-green-700 hover:to-green-500 transition">
              Trocar senha
            </button>
          </form>
        )}
        {step === "sucesso" && (
          <div className="text-center space-y-2">
            <h2 className="text-lg font-bold mb-2 text-green-400">Senha alterada com sucesso!</h2>
            <button className="w-full bg-green-600 text-white py-2 rounded font-bold" onClick={onClose}>Fechar</button>
          </div>
        )}
      </div>
    </div>
  );
}