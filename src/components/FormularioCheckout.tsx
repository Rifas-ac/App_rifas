"use client";

import React, { useState } from 'react';
import { z } from 'zod';

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  sobrenome: z.string().min(1, "Sobrenome é obrigatório"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  cpf: z.string().length(14, "CPF inválido"), // Assuming format xxx.xxx.xxx-xx
});

type FormData = z.infer<typeof formSchema>;

interface FormularioCheckoutProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const FormularioCheckout: React.FC<FormularioCheckoutProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    cpf: '',
  });
  const [errors, setErrors] = useState<z.ZodError | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = formSchema.safeParse(formData);
    if (result.success) {
      onSubmit(result.data);
      setErrors(null);
    } else {
      setErrors(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-300">Nome</label>
        <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        {errors?.flatten().fieldErrors.nome && <p className="mt-1 text-sm text-red-500">{errors.flatten().fieldErrors.nome}</p>}
      </div>
      <div>
        <label htmlFor="sobrenome" className="block text-sm font-medium text-gray-300">Sobrenome</label>
        <input type="text" name="sobrenome" id="sobrenome" value={formData.sobrenome} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        {errors?.flatten().fieldErrors.sobrenome && <p className="mt-1 text-sm text-red-500">{errors.flatten().fieldErrors.sobrenome}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        {errors?.flatten().fieldErrors.email && <p className="mt-1 text-sm text-red-500">{errors.flatten().fieldErrors.email}</p>}
      </div>
      <div>
        <label htmlFor="telefone" className="block text-sm font-medium text-gray-300">Telefone</label>
        <input type="text" name="telefone" id="telefone" value={formData.telefone} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        {errors?.flatten().fieldErrors.telefone && <p className="mt-1 text-sm text-red-500">{errors.flatten().fieldErrors.telefone}</p>}
      </div>
      <div>
        <label htmlFor="cpf" className="block text-sm font-medium text-gray-300">CPF</label>
        <input type="text" name="cpf" id="cpf" value={formData.cpf} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        {errors?.flatten().fieldErrors.cpf && <p className="mt-1 text-sm text-red-500">{errors.flatten().fieldErrors.cpf}</p>}
      </div>
      <button type="submit" disabled={isLoading} className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">
        {isLoading ? 'Gerando PIX...' : 'Gerar PIX'}
      </button>
    </form>
  );
};

export default FormularioCheckout;
