"use client";

import type React from "react";
import { useState } from "react";
import { User, Mail, Phone, CreditCard } from "lucide-react";
import { formatarCPF, obterMensagemErroCPF, formatarTelefone } from "@/utils/validacoes";

interface FormularioCheckoutProps {
  onSubmit: (dados: DadosCheckout) => void;
  carregando: boolean;
  valorTotal: number;
  quantidadeNumeros: number;
}

export interface DadosCheckout {
  nome: string;
  sobrenome: string;
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
    sobrenome: "",
    email: "",
    telefone: "",
    cpf: "",
  });

  const [erros, setErros] = useState<Partial<Record<keyof DadosCheckout, string>>>({});

  const validarFormulario = (): boolean => {
    const novosErros: Partial<Record<keyof DadosCheckout, string>> = {};

    if (!dados.nome.trim() || dados.nome.trim().length < 2) {
      novosErros.nome = "Nome inválido";
    }
    if (!dados.sobrenome.trim() || dados.sobrenome.trim().length < 2) {
      novosErros.sobrenome = "Sobrenome inválido";
    }
    if (!dados.email.trim() || !/\S+@\S+\.\S+/.test(dados.email)) {
      novosErros.email = "Email inválido";
    }
    if (dados.telefone.replace(/\D/g, "").length < 10) {
      novosErros.telefone = "Telefone inválido";
    }
    const mensagemErroCPF = obterMensagemErroCPF(dados.cpf);
    if (mensagemErroCPF) {
      novosErros.cpf = mensagemErroCPF;
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

  const handleChange = (campo: keyof DadosCheckout, valor: string) => {
    let valorFormatado = valor;
    if (campo === "cpf") valorFormatado = formatarCPF(valor);
    if (campo === "telefone") valorFormatado = formatarTelefone(valor);
    setDados((prev) => ({ ...prev, [campo]: valorFormatado }));
    if (erros[campo]) setErros((prev) => ({ ...prev, [campo]: undefined }));
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 text-white">
      <div className="mb-6">
        <div className="bg-gray-700 rounded p-3 text-center">
          <p className="text-sm text-gray-300">Você está comprando</p>
          <p className="text-lg font-bold text-orange-500">{quantidadeNumeros} números</p>
          <p className="text-xl font-bold text-green-500">R$ {valorTotal.toFixed(2).replace(".", ",")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <User className="inline w-4 h-4 mr-2" />
              Nome
            </label>
            <input
              type="text"
              value={dados.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 ${
                erros.nome ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-orange-500"
              }`}
              placeholder="Seu nome"
            />
            {erros.nome && <p className="text-red-500 text-xs mt-1">{erros.nome}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              <User className="inline w-4 h-4 mr-2" />
              Sobrenome
            </label>
            <input
              type="text"
              value={dados.sobrenome}
              onChange={(e) => handleChange("sobrenome", e.target.value)}
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 ${
                erros.sobrenome ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-orange-500"
              }`}
              placeholder="Seu sobrenome"
            />
            {erros.sobrenome && <p className="text-red-500 text-xs mt-1">{erros.sobrenome}</p>}
          </div>
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
          {erros.email && <p className="text-red-500 text-xs mt-1">{erros.email}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
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
            {erros.telefone && <p className="text-red-500 text-xs mt-1">{erros.telefone}</p>}
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
            {erros.cpf && <p className="text-red-500 text-xs mt-1">{erros.cpf}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={carregando}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
          {carregando ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Processando...
            </>
          ) : (
            "Ir para Pagamento"
          )}
        </button>
      </form>

      <p className="text-xs text-gray-400 text-center mt-4">
        🔒 Seus dados estão protegidos e serão usados apenas para esta transação.
      </p>
    </div>
  );
};

export default FormularioCheckout;