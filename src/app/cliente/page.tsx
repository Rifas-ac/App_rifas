"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CadastroSucessoPopup from "@/components/CadastroSucessoPopup";

// Função para aplicar máscara de CPF
const formatCPF = (value: string) => {
  return value
    .replace(/\D/g, "") // Remove tudo que não é dígito
    .replace(/(\d{3})(\d)/, "$1.$2") // Adiciona primeiro ponto
    .replace(/(\d{3})(\d)/, "$1.$2") // Adiciona segundo ponto
    .replace(/(\d{3})(\d{1,2})/, "$1-$2") // Adiciona hífen
    .replace(/(-\d{2})\d+?$/, "$1"); // Limita a 11 dígitos
};

// Função para aplicar máscara de telefone
const formatPhone = (value: string) => {
  return value
    .replace(/\D/g, "") // Remove tudo que não é dígito
    .replace(/(\d{2})(\d)/, "($1) $2") // Adiciona parênteses e espaço
    .replace(/(\d{5})(\d{4})/, "$1-$2") // Formato: (XX) XXXXX-XXXX
    .replace(/(-\d{4})\d+?$/, "$1"); // Limita a 11 dígitos
};

export default function ClientePage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const email = form.get("email");
    const senha = form.get("senha");

    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();

    if (res.ok && data.success) {
      localStorage.setItem("usuarioLogado", "true");
      router.push("/");
    } else if (data.error === "email") {
      setError("E-mail não cadastrado");
    } else if (data.error === "senha") {
      setError("Senha incorreta");
    } else {
      setError("Erro inesperado. Tente novamente.");
    }
  }

  async function handleCadastro(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const nome = form.get("nome") as string;
    const email = form.get("email") as string;
    const senha = form.get("senha") as string;
    const cpfValue = form.get("cpf") as string;
    const telefoneValue = form.get("telefone") as string;
    const [firstName, ...lastName] = nome.split(" ");

    const res = await fetch("/api/cadastro", {
      method: "POST",
      body: JSON.stringify({
        nome: firstName,
        sobrenome: lastName.join(" "),
        email,
        senha,
        cpf: cpfValue,
        telefone: telefoneValue,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (res.ok && data.success) {
      setShowSuccessPopup(true);
    } else if (data.error) {
      setError(data.error);
    } else {
      setError("Erro ao realizar o cadastro. Tente novamente.");
    }
  }

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setTelefone(formatted);
  };

  const closePopupAndSwitchToLogin = () => {
    setShowSuccessPopup(false);
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-md mx-auto">
        {showSuccessPopup && <CadastroSucessoPopup onClose={closePopupAndSwitchToLogin} />}
        <div className="w-full bg-gray-800 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">{isLogin ? "Entrar na Conta" : "Cadastro de Cliente"}</h2>
          <form onSubmit={isLogin ? handleLogin : handleCadastro}>
            {!isLogin && (
              <input
                type="text"
                name="nome"
                placeholder="Nome Completo"
                className="mb-4 w-full p-2 rounded bg-gray-700 text-white"
                required
              />
            )}
            <input
              type="email"
              name="email"
              required
              pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
              placeholder="E-mail"
              className="mb-4 w-full p-2 rounded bg-gray-700 text-white"
            />
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              className="mb-6 w-full p-2 rounded bg-gray-700 text-white"
              required
            />
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="cpf"
                  value={cpf}
                  onChange={handleCpfChange}
                  placeholder="CPF"
                  className="mb-4 w-full p-2 rounded bg-gray-700 text-white"
                  maxLength={14}
                  required
                />
                <input
                  type="tel"
                  name="telefone"
                  value={telefone}
                  onChange={handlePhoneChange}
                  placeholder="Telefone"
                  className="mb-4 w-full p-2 rounded bg-gray-700 text-white"
                  maxLength={16}
                  required
                />
              </>
            )}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition">
              {isLogin ? "Entrar" : "Cadastrar"}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              className="text-blue-400 underline"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              type="button">
              {isLogin ? "Criar conta" : "Já tenho conta"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
