"use client";

import React, { useState } from "react";
import { Plus, Save, Image, Calendar, DollarSign, Hash, Users, Settings } from "lucide-react";

// Interface para definir o tipo dos dados do formulário
interface FormData {
  titulo: string;
  descricao: string;
  preco: string;
  totalNumeros: string;
  dataFinal: string;
  imagem: string;
  premio: string;
  regulamento: string;
}

// Interface para mensagens de feedback
interface Message {
  type: "success" | "error" | "";
  text: string;
}

const AdminComponent = () => {
  // Estados para controlar o formulário de nova rifa
  const [formData, setFormData] = useState<FormData>({
    titulo: "",
    descricao: "",
    preco: "",
    totalNumeros: "",
    dataFinal: "",
    imagem: "",
    premio: "",
    regulamento: "",
  });

  // Estado para controlar se está salvando
  const [isLoading, setIsLoading] = useState(false);

  // Estado para mostrar mensagens de sucesso/erro
  const [message, setMessage] = useState<Message>({ type: "", text: "" });

  // Função para atualizar os campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Função para submeter o formulário
  const handleSubmit = async () => {
    // Prevenir múltiplos cliques
    if (isLoading) return;

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Validação básica dos campos obrigatórios
      if (
        !formData.titulo ||
        !formData.descricao ||
        !formData.preco ||
        !formData.totalNumeros ||
        !formData.dataFinal ||
        !formData.premio
      ) {
        throw new Error("Por favor, preencha todos os campos obrigatórios");
      }

      // Aqui você fará a chamada para a API do Next.js
      // A rota da API deve estar em: src/app/api/rifas/route.ts
      const response = await fetch("/api/rifas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          preco: parseFloat(formData.preco),
          totalNumeros: parseInt(formData.totalNumeros),
        }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Rifa criada com sucesso!" });
        // Limpar formulário após sucesso
        setFormData({
          titulo: "",
          descricao: "",
          preco: "",
          totalNumeros: "",
          dataFinal: "",
          imagem: "",
          premio: "",
          regulamento: "",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar rifa");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Erro ao criar rifa. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do Admin */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
            </div>
            <div className="text-sm text-gray-500">Gerencie suas rifas aqui</div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Card principal do formulário */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header do card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center">
              <Plus className="h-6 w-6 text-white mr-2" />
              <h2 className="text-xl font-semibold text-white">Cadastrar Nova Rifa</h2>
            </div>
          </div>

          {/* Formulário */}
          <div className="p-6 space-y-6">
            {/* Mensagem de feedback */}
            {message.text && (
              <div
                className={`p-4 rounded-md ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}>
                {message.text}
              </div>
            )}

            {/* Grid com 2 colunas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Título da Rifa */}
              <div className="md:col-span-2">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Hash className="h-4 w-4 mr-1" />
                  Título da Rifa *
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Ex: iPhone 15 Pro Max"
                  required
                />
              </div>

              {/* Preço */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Preço por Número (R$) *
                </label>
                <input
                  type="number"
                  name="preco"
                  value={formData.preco}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Ex: 10.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              {/* Total de Números */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Users className="h-4 w-4 mr-1" />
                  Total de Números *
                </label>
                <input
                  type="number"
                  name="totalNumeros"
                  value={formData.totalNumeros}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Ex: 1000"
                  min="1"
                  required
                />
              </div>

              {/* Data Final */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  Data Final do Sorteio *
                </label>
                <input
                  type="datetime-local"
                  name="dataFinal"
                  value={formData.dataFinal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  required
                />
              </div>

              {/* URL da Imagem */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Image className="h-4 w-4 mr-1" />
                  URL da Imagem do Prêmio
                </label>
                <input
                  type="url"
                  name="imagem"
                  value={formData.imagem}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            </div>

            {/* Descrição do Prêmio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição do Prêmio *</label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Descreva detalhadamente o prêmio..."
                required
              />
            </div>

            {/* Prêmio (nome curto) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Prêmio *</label>
              <input
                type="text"
                name="premio"
                value={formData.premio}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Ex: iPhone 15 Pro Max 256GB"
                required
              />
            </div>

            {/* Regulamento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Regulamento</label>
              <textarea
                name="regulamento"
                value={formData.regulamento}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Digite o regulamento da rifa..."
              />
            </div>

            {/* Botão de submit */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Criar Rifa
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Card de informações */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Informações Importantes</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Certifique-se de que todos os campos obrigatórios (*) estejam preenchidos</li>
            <li>• A data final deve ser posterior à data atual</li>
            <li>• A imagem deve ser uma URL válida e acessível</li>
            <li>• O regulamento ajuda a esclarecer as regras para os participantes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminComponent;
