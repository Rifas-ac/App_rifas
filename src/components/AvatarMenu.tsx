"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  obterMensagemErroCPF,
  obterMensagemErroEmail,
  obterMensagemErroTelefone,
  formatarCPF,
  formatarTelefone,
} from "../utils/validacoes";

// Dados do admin fixos
const ADMIN_EMAIL = "calebexmz9@gmail.com";
const ADMIN_SENHA = "88224646Ba!";

export default function AvatarMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showCadastro, setShowCadastro] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    cpf: "",
    telefone: "",
  });
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const userTypeFromCookie = Cookies.get("userType");
    if (userTypeFromCookie) {
      setUserType(userTypeFromCookie);
    }
  }, []);

  // Cores da bolinha conforme tipo de usuário
  const color = userType === "admin" ? "bg-orange-500" : userType === "comprador" ? "bg-green-500" : "bg-blue-500";

  // Ícone do avatar
  const avatarIcon = (
    <span role="img" aria-label="avatar" className="text-white text-xl">
      👤
    </span>
  );

    async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Try admin login first
    if (email === ADMIN_EMAIL && senha === ADMIN_SENHA) {
      Cookies.set("userType", "admin");
      Cookies.set("userEmail", email);
      setUserType("admin");
      setShowLogin(false);
      setOpen(false);
      window.location.reload();
      return;
    }

    // If not admin, try regular user login via API
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      if (response.ok) {
        // Login successful
        Cookies.set("userType", "comprador");
        Cookies.set("userEmail", email);
        setUserType("comprador");
        setShowLogin(false);
        setOpen(false);
        window.location.reload();
      } else {
        // Login failed
        const errorData = await response.json();
        setError(errorData.message || "Credenciais inválidas.");
      }
    } catch (apiError) {
      console.error("Erro ao tentar fazer login:", apiError);
      setError("Erro ao conectar com o servidor de autenticação.");
    }
  }

  function handleCadastroSubmit(e: React.FormEvent) {
    e.preventDefault();
    const emailError = obterMensagemErroEmail(email);
    const cpfError = obterMensagemErroCPF(cpf);
    const telefoneError = obterMensagemErroTelefone(telefone);

    if (emailError || cpfError || telefoneError) {
      setErrors({
        email: emailError || "",
        cpf: cpfError || "",
        telefone: telefoneError || "",
      });
      return;
    }

    // Simulação de cadastro
    alert("Cadastro realizado com sucesso! (simulação)");
    Cookies.set("userType", "comprador");
    Cookies.set("userEmail", email);
    setUserType("comprador");
    setShowCadastro(false);
    setOpen(false);
    setError("");
    window.location.reload();
  }

  function handleLogout() {
    Cookies.remove("userType");
    Cookies.remove("userEmail");
    setUserType(null);
    setOpen(false);
    window.location.reload();
  }

  return (
    <div className="relative">
      <button
        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white ${color}`}
        onClick={() => setOpen(!open)}>
        {avatarIcon}
      </button>
      {open && (
        <div className="absolute left-0 mt-2 bg-gray-800 rounded shadow-lg p-4 z-10 min-w-[200px]">
          {/* Não logado */}
          {!userType && !showLogin && !showCadastro && (
            <>
              <button
                className="w-full text-left py-2 px-2 rounded hover:bg-gray-700 text-white"
                onClick={() => setShowLogin(true)}>
                Login
              </button>
              <button
                className="w-full text-left py-2 px-2 rounded hover:bg-gray-700 text-white mt-2"
                onClick={() => setShowCadastro(true)}>
                Cadastrar
              </button>
            </>
          )}

          {/* Formulário de login */}
          {showLogin && (
            <form onSubmit={handleLoginSubmit} className="space-y-2">
              <input
                type="email"
                placeholder="E-mail"
                className="w-full p-2 rounded bg-gray-700 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Senha"
                className="w-full p-2 rounded bg-gray-700 text-white"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div className="flex gap-2">
                <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded font-bold">
                  Entrar
                </button>
                <button
                  type="button"
                  className="w-full bg-gray-600 text-white py-2 rounded font-bold"
                  onClick={() => setShowLogin(false)}>
                  Voltar
                </button>
              </div>
            </form>
          )}

          {/* Formulário de cadastro */}
          {showCadastro && (
            <form onSubmit={handleCadastroSubmit} className="space-y-2">
              <input
                type="text"
                placeholder="Nome"
                className="w-full p-2 rounded bg-gray-700 text-white"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="E-mail"
                className="w-full p-2 rounded bg-gray-700 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
              <input
                type="text"
                placeholder="CPF"
                className="w-full p-2 rounded bg-gray-700 text-white"
                value={cpf}
                onChange={(e) => setCpf(formatarCPF(e.target.value))}
                required
              />
              {errors.cpf && <div className="text-red-500 text-sm">{errors.cpf}</div>}
              <input
                type="text"
                placeholder="Telefone"
                className="w-full p-2 rounded bg-gray-700 text-white"
                value={telefone}
                onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                required
              />
              {errors.telefone && <div className="text-red-500 text-sm">{errors.telefone}</div>}
              <input
                type="password"
                placeholder="Senha"
                className="w-full p-2 rounded bg-gray-700 text-white"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="w-full bg-green-500 text-white py-2 rounded font-bold">
                  Cadastrar
                </button>
                <button
                  type="button"
                  className="w-full bg-gray-600 text-white py-2 rounded font-bold"
                  onClick={() => setShowCadastro(false)}>
                  Voltar
                </button>
              </div>
            </form>
          )}

          {/* Comprador logado */}
          {userType === "comprador" && (
            <>
              <div className="mb-2 text-green-400 font-bold">Comprador</div>
              <button
                className="w-full text-left py-2 px-2 rounded hover:bg-gray-700 text-white"
                onClick={() => router.push("/cliente/status")}>
                Status
              </button>
              <button
                className="w-full text-left py-2 px-2 rounded hover:bg-gray-700 text-white mt-2"
                onClick={handleLogout}>
                Sair
              </button>
            </>
          )}

          {/* Administrador logado */}
          {userType === "admin" && (
            <>
              <div className="mb-2 text-orange-400 font-bold">Administrador</div>
              <button
                className="w-full text-left py-2 px-2 rounded hover:bg-gray-700 text-white"
                onClick={() => router.push("/adm/status")}>
                Área do Administrador
              </button>
              <button
                className="w-full text-left py-2 px-2 rounded hover:bg-gray-700 text-white mt-2"
                onClick={handleLogout}>
                Sair
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
