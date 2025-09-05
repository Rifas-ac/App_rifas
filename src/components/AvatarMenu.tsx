"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Dados do admin fixos
const ADMIN_EMAIL = "calebexmz9@gmail.com";
const ADMIN_SENHA = "8822Bem!";

export default function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showCadastro, setShowCadastro] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [userType, setUserType] = useState(typeof window !== "undefined" ? localStorage.getItem("userType") : null);

  // Cores da bolinha conforme tipo de usuário
  const color = userType === "admin" ? "bg-orange-500" : userType === "comprador" ? "bg-green-500" : "bg-blue-500";

  // Ícone do avatar
  const avatarIcon = (
    <span role="img" aria-label="avatar" className="text-white text-xl">
      👤
    </span>
  );

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email === ADMIN_EMAIL && senha === ADMIN_SENHA) {
      localStorage.setItem("userType", "admin");
      setUserType("admin");
      setShowLogin(false);
      setOpen(false);
      setError("");
      window.location.reload();
    } else if (email && senha) {
      localStorage.setItem("userType", "comprador");
      setUserType("comprador");
      setShowLogin(false);
      setOpen(false);
      setError("");
      window.location.reload();
    } else {
      setError("Preencha todos os campos!");
    }
  }

  function handleLogout() {
    localStorage.removeItem("userType");
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

          {/* Formulário de cadastro (simulação) */}
          {showCadastro && (
            <form className="space-y-2">
              <input type="text" placeholder="Nome" className="w-full p-2 rounded bg-gray-700 text-white" required />
              <input type="email" placeholder="E-mail" className="w-full p-2 rounded bg-gray-700 text-white" required />
              <input
                type="password"
                placeholder="Senha"
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  className="w-full bg-green-500 text-white py-2 rounded font-bold"
                  onClick={() => alert("Cadastro realizado (simulação)")}>
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
                onClick={() => alert("Meu Perfil")}>
                Meu Perfil
              </button>
              <button
                className="w-full text-left py-2 px-2 rounded hover:bg-gray-700 text-white"
                onClick={() => alert("Status: Ativo")}>
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
              <div className="text-white text-sm mb-2">
                <b>Nome:</b> Kaleb Xavier
                <br />
                <b>Email:</b> calebexmz9@gmail.com
                <br />
                <b>CPF:</b> 059.110.381-88
                <br />
                <b>Telefone:</b> (61) 98652-0888
              </div>
              <button
                className="w-full text-left py-2 px-2 rounded hover:bg-gray-700 text-white"
                onClick={() => alert("Área do Administrador")}>
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

<div className="absolute top-4 left-4">
  <AvatarMenu />
</div>;
