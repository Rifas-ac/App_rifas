'use client';
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

// As credenciais de admin agora devem ser configuradas no seu ambiente
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
const ADMIN_SENHA = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

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

  const color = userType === "admin" ? "bg-orange-500" : userType === "comprador" ? "bg-green-500" : "bg-blue-500";
  const avatarIcon = <span role="img" aria-label="avatar" className="text-white text-xl">👤</span>;

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validação de segurança: verifica se as credenciais de admin estão configuradas
    if (email === ADMIN_EMAIL && (!ADMIN_SENHA || !ADMIN_EMAIL)) {
        setError("As credenciais de administrador não estão configuradas no servidor.");
        return;
    }
    
    // Login de Admin
    if (email === ADMIN_EMAIL && senha === ADMIN_SENHA) {
      Cookies.set("userType", "admin", { secure: true, sameSite: 'strict' });
      Cookies.set("userEmail", email, { secure: true, sameSite: 'strict' });
      setUserType("admin");
      setShowLogin(false);
      setOpen(false);
      window.location.reload();
      return;
    }

    // Login de Comprador
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (response.ok) {
        Cookies.set("userType", "comprador", { secure: true, sameSite: 'strict' });
        Cookies.set("userEmail", email, { secure: true, sameSite: 'strict' });
        setUserType("comprador");
        setShowLogin(false);
        setOpen(false);
        window.location.reload();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Credenciais inválidas.");
      }
    } catch (apiError) {
      console.error("Erro ao tentar fazer login:", apiError);
      setError("Erro ao conectar com o servidor.");
    }
  }

  async function handleCadastroSubmit(e: React.FormEvent) {
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

    try {
        const [firstName, ...lastNameParts] = nome.split(" ");
        const response = await fetch("/api/cadastro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: firstName,
            sobrenome: lastNameParts.join(" "),
            email,
            cpf,
            telefone,
            senha,
          }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro no cadastro');
        }
        
        // Sucesso
        alert("Cadastro realizado com sucesso! Faça o login para continuar.");
        setShowCadastro(false);
        setShowLogin(true); // Direciona para o login
        setError("");
        
    } catch(err: any) {
        setError(err.message);
    }
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
        <div className="absolute left-0 mt-2 bg-gray-800 rounded shadow-lg p-4 z-10 w-80">
          {!userType && !showLogin && !showCadastro && (
            <>
              <button className="w-full text-left py-2 px-2 rounded hover:bg-gray-700 text-white" onClick={() => setShowLogin(true)}>Login</button>
              <button className="w-full text-left py-2 px-2 rounded hover:bg-gray-700 text-white mt-2" onClick={() => setShowCadastro(true)}>Cadastrar</button>
            </>
          )}

          {showLogin && (
            <form onSubmit={handleLoginSubmit} className="space-y-2">
              <input type="email" placeholder="E-mail" className="w-full p-2 rounded bg-gray-700 text-white" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Senha" className="w-full p-2 rounded bg-gray-700 text-white" value={senha} onChange={(e) => setSenha(e.target.value)} required />
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div className="flex gap-2">
                <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded font-bold">Entrar</button>
                <button type="button" className="w-full bg-gray-600 text-white py-2 rounded font-bold" onClick={() => { setShowLogin(false); setError(""); }}>Voltar</button>
              </div>
            </form>
          )}

          {showCadastro && (
             <form onSubmit={handleCadastroSubmit} className="space-y-2">
                <input type="text" placeholder="Nome Completo" className="w-full p-2 rounded bg-gray-700 text-white" value={nome} onChange={(e) => setNome(e.target.value)} required />
                <input type="email" placeholder="E-mail" className="w-full p-2 rounded bg-gray-700 text-white" value={email} onChange={(e) => setEmail(e.target.value)} required />
                {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                <input type="text" placeholder="CPF" className="w-full p-2 rounded bg-gray-700 text-white" value={cpf} onChange={(e) => setCpf(formatarCPF(e.target.value))} required />
                {errors.cpf && <div className="text-red-500 text-sm">{errors.cpf}</div>}
                <input type="text" placeholder="Telefone" className="w-full p-2 rounded bg-gray-700 text-white" value={telefone} onChange={(e) => setTelefone(formatarTelefone(e.target.value))} required />
                {errors.telefone && <div className="text-red-500 text-sm">{errors.telefone}</div>}
                <input type="password" placeholder="Senha" className="w-full p-2 rounded bg-gray-700 text-white" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                 {error && <div className="text-red-500 text-sm">{error}</div>}
                <div className="flex gap-2">
                    <button type="submit" className="w-full bg-green-500 text-white py-2 rounded font-bold">Cadastrar</button>
                    <button type="button" className="w-full bg-gray-600 text-white py-2 rounded font-bold" onClick={() => {setShowCadastro(false); setErrors({ email: "", cpf: "", telefone: "" }); setError("")}}>Voltar</button>
                </div>
            </form>
          )}
          
          {userType === "comprador" && (
            <>
              <div className="mb-2 text-green-400 font-bold">Comprador</div>
              <button className="w-full text-left py-2 px-2 rounded hover:bg-gray-700 text-white" onClick={() => router.push("/cliente/status")}>Meus Números</button>
              <button className="w-full text-left py-2 px-2 rounded hover:bg-gray-700 text-white mt-2" onClick={handleLogout}>Sair</button>
            </>
          )}
          
          {userType === "admin" && (
            <>
              <div className="mb-2 text-orange-400 font-bold">Administrador</div>
              <button className="w-full text-left py-2 px-2 rounded hover:bg-gray-700 text-white" onClick={() => router.push("/adm/status")}>Painel Admin</button>
              <button className="w-full text-left py-2 px-2 rounded hover:bg-gray-700 text-white mt-2" onClick={handleLogout}>Sair</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
