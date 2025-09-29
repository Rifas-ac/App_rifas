"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { buscarUsuarioLogado } from "@/lib/api";
import FormularioCheckout from "./FormularioCheckout";

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  sobrenome: z.string().min(1, "Sobrenome é obrigatório"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  cpf: z.string().length(14, "CPF inválido"), // Formato xxx.xxx.xxx-xx
});

type FormData = z.infer<typeof formSchema>;

// Defina o tipo do usuário
export type Usuario = {
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  cpf: string;
};

interface FormularioCheckoutProps {
  rifaId: string;
  quantidade: number;
}

const ModalFinalizarCompra: React.FC<FormularioCheckoutProps> = ({ rifaId, quantidade }) => {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    sobrenome: "",
    email: "",
    telefone: "",
    cpf: "",
  });
  const [errors, setErrors] = useState<z.ZodError<FormData> | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [valorTotal, setValorTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    buscarUsuarioLogado()
      .then((usuario: Usuario) => {
        setFormData({
          nome: usuario.nome || "",
          sobrenome: usuario.sobrenome || "",
          email: usuario.email || "",
          telefone: usuario.telefone || "",
          cpf: usuario.cpf || "",
        });
      })
      .catch(() => router.push("/login"));
  }, [router]);

  useEffect(() => {
    setValorTotal(quantidade * 11.97); // ajuste conforme sua lógica
  }, [quantidade]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = formSchema.safeParse(formData);
    if (result.success) {
      setErrors(null);
      setCarregando(true);
      try {
        await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rifaId, quantidade }),
        });
        // ...restante do fluxo...
      } catch (error) {
        console.error("Erro ao realizar o checkout:", error);
      } finally {
        setCarregando(false);
      }
    } else {
      setErrors(result.error);
    }
  };

  // Força a tipagem do fieldErrors para evitar erro de propriedade inexistente
  const fieldErrors = (errors?.flatten().fieldErrors as Partial<Record<keyof FormData, string[]>>) ?? {};

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#181C23] rounded-xl p-6 w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">Finalizar Compra</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 mb-4 text-center bg-gray-700 rounded-lg">
            <p className="text-lg">
              Você está adquirindo <span className="font-bold text-blue-400">{quantidade}</span> número(s) da sorte.
            </p>
            <p className="text-xl font-semibold">
              Valor Total: <span className="text-green-400">R$ {valorTotal.toFixed(2).replace(".", ",")}</span>
            </p>
          </div>
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-300">
              Nome
            </label>
            <input
              type="text"
              name="nome"
              id="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {fieldErrors.nome?.[0] && <p className="mt-1 text-sm text-red-500">{fieldErrors.nome[0]}</p>}
          </div>
          <div>
            <label htmlFor="sobrenome" className="block text-sm font-medium text-gray-300">
              Sobrenome
            </label>
            <input
              type="text"
              name="sobrenome"
              id="sobrenome"
              value={formData.sobrenome}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {fieldErrors.sobrenome?.[0] && <p className="mt-1 text-sm text-red-500">{fieldErrors.sobrenome[0]}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {fieldErrors.email?.[0] && <p className="mt-1 text-sm text-red-500">{fieldErrors.email[0]}</p>}
          </div>
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-300">
              Telefone
            </label>
            <input
              type="text"
              name="telefone"
              id="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {fieldErrors.telefone?.[0] && <p className="mt-1 text-sm text-red-500">{fieldErrors.telefone[0]}</p>}
          </div>
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-300">
              CPF
            </label>
            <input
              type="text"
              name="cpf"
              id="cpf"
              value={formData.cpf}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {fieldErrors.cpf?.[0] && <p className="mt-1 text-sm text-red-500">{fieldErrors.cpf[0]}</p>}
          </div>
          <button
            type="submit"
            disabled={carregando}
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">
            {carregando ? "Gerando PIX..." : "Gerar PIX"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalFinalizarCompra;
