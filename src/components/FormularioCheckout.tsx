import React, { useState } from "react";
import { User, Mail, Phone, CreditCard } from "lucide-react";

interface FormularioCheckoutProps {
  onSubmit: (dados: DadosCheckout) => void;
  carregando: boolean;
  valorTotal: number;
  quantidadeNumeros: number;
}

interface DadosCheckout {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
}

const FormularioCheckout: React.FC<FormularioCheckoutProps> = ({
  onSubmit,
  carregando,
  valorTotal,
  quantidadeNumeros,
}) => {
  const [dados, setDados] = useState<DadosCheckout>({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
  });

  const [erros, setErros] = useState<Partial<DadosCheckout>>({});

  const validarFormulario = (): boolean => {
    const novosErros: Partial<DadosCheckout> = {};

    if (!dados.nome.trim()) {
      novosErros.nome = "Nome é obrigatório";
    }

    if (!dados.email.trim()) {
      novosErros.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(dados.email)) {
      novosErros.email = "Email inválido";
    }

    if (!dados.telefone.trim()) {
      novosErros.telefone = "Telefone é obrigatório";
    }

    if (!dados.cpf.trim()) {
      novosErros.cpf = "CPF é obrigatório";
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(dados.cpf) && !/^\d{11}$/.test(dados.cpf.replace(/\D/g, ""))) {
      novosErros.cpf = "CPF inválido";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validarFormulario()) {
      onSubmit(dados);
    }
  };

  const formatarCPF = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, "");
    return apenasNumeros
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const formatarTelefone = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, "");
    return apenasNumeros
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .replace(/(\d{4})-(\d)(\d{4})/, "$1$2-$3")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  const handleChange = (campo: keyof DadosCheckout, valor: string) => {
    let valorFormatado = valor;

    if (campo === "cpf") {
      valorFormatado = formatarCPF(valor);
    } else if (campo === "telefone") {
      valorFormatado = formatarTelefone(valor);
    }

    setDados((prev) => ({ ...prev, [campo]: valorFormatado }));

    // Limpar erro do campo quando usuário começar a digitar
    if (erros[campo]) {
      setErros((prev) => ({ ...prev, [campo]: undefined }));
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 text-white">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-center mb-2">Finalizar Participação</h2>
        <div className="bg-gray-700 rounded p-3 text-center">
          <p className="text-sm text-gray-300">Você está comprando</p>
          <p className="text-lg font-bold text-orange-500">{quantidadeNumeros} números</p>
          <p className="text-xl font-bold text-green-500">R$ {valorTotal.toFixed(2).replace(".", ",")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            <User className="inline w-4 h-4 mr-2" />
            Nome Completo
          </label>
          <input
            type="text"
            value={dados.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
            className={`w-full px-3 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 ${
              erros.nome ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-orange-500"
            }`}
            placeholder="Digite seu nome completo"
          />
          {erros.nome && <p className="text-red-500 text-sm mt-1">{erros.nome}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            <Mail className="inline w-4 h-4 mr-2" />
            Email
          </label>
          <input
            type="email"
            value={dados.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={`w-full px-3 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 ${
              erros.email ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-orange-500"
            }`}
            placeholder="seu@email.com"
          />
          {erros.email && <p className="text-red-500 text-sm mt-1">{erros.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            <Phone className="inline w-4 h-4 mr-2" />
            Telefone
          </label>
          <input
            type="tel"
            value={dados.telefone}
            onChange={(e) => handleChange("telefone", e.target.value)}
            className={`w-full px-3 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 ${
              erros.telefone ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-orange-500"
            }`}
            placeholder="(11) 99999-9999"
            maxLength={15}
          />
          {erros.telefone && <p className="text-red-500 text-sm mt-1">{erros.telefone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            <CreditCard className="inline w-4 h-4 mr-2" />
            CPF
          </label>
          <input
            type="text"
            value={dados.cpf}
            onChange={(e) => handleChange("cpf", e.target.value)}
            className={`w-full px-3 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 ${
              erros.cpf ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-orange-500"
            }`}
            placeholder="000.000.000-00"
            maxLength={14}
          />
          {erros.cpf && <p className="text-red-500 text-sm mt-1">{erros.cpf}</p>}
        </div>

        <button
          type="submit"
          disabled={carregando}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-200">
          {carregando ? "Processando..." : "Continuar para Pagamento"}
        </button>
      </form>

      <p className="text-xs text-gray-400 text-center mt-4">
        Seus dados estão protegidos e serão usados apenas para esta transação
      </p>
    </div>
  );
};

export default FormularioCheckout;
