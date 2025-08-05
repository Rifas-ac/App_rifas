"use client";

import React, { useState } from "react";
import { User, Settings, ShoppingBag, LogOut, ChevronDown, Shield } from "lucide-react";

const ProfileButton = () => {
  // Estado para controlar se o dropdown está aberto
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Estado para armazenar o tipo de usuário (cliente ou admin)
  // Você pode pegar isso de um contexto ou localStorage posteriormente
  const [userType, setUserType] = useState<"cliente" | "admin">("cliente");

  // Função para alternar o dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Função para fechar o dropdown quando clicar fora
  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Função para navegar para diferentes seções
  const handleNavigation = (section: string) => {
    closeDropdown();

    switch (section) {
      case "minha-conta":
        // Navegar para página de conta do cliente
        window.location.href = "/minha-conta";
        break;
      case "minhas-compras":
        // Navegar para histórico de compras
        window.location.href = "/minhas-compras";
        break;
      case "admin":
        // Navegar para painel admin
        window.location.href = "/admin";
        break;
      case "admin-rifas":
        // Navegar para gerenciar rifas (página futura)
        window.location.href = "/admin/rifas";
        break;
      case "logout":
        // Implementar logout
        // Limpar localStorage, cookies, etc.
        localStorage.removeItem("userType");
        console.log("Logout realizado");
        // Redirecionar para página inicial
        window.location.href = "/";
        break;
      default:
        break;
    }
  };

  // Função para alternar entre cliente e admin
  const toggleUserType = () => {
    const newUserType = userType === "cliente" ? "admin" : "cliente";
    setUserType(newUserType);

    // Salvar no localStorage para persistir a escolha
    localStorage.setItem("userType", newUserType);
    closeDropdown();
  };

  // useEffect para carregar o tipo de usuário do localStorage ao montar o componente
  React.useEffect(() => {
    const savedUserType = localStorage.getItem("userType") as "cliente" | "admin" | null;
    if (savedUserType) {
      setUserType(savedUserType);
    }
  }, []);

  return (
    <div className="relative">
      {/* Botão principal do perfil */}
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200 border border-gray-600 hover:border-gray-500 shadow-lg backdrop-blur-sm">
        {/* Ícone do usuário */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            userType === "admin"
              ? "bg-gradient-to-br from-purple-500 to-pink-600"
              : "bg-gradient-to-br from-blue-500 to-cyan-600"
          }`}>
          {userType === "admin" ? <Shield className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
        </div>

        {/* Texto e indicador */}
        <div className="flex items-center space-x-1">
          <span className="text-sm font-medium">{userType === "cliente" ? "Cliente" : "Admin"}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <>
          {/* Overlay para fechar ao clicar fora */}
          <div className="fixed inset-0 z-40" onClick={closeDropdown}></div>

          {/* Menu dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
            {/* Header do dropdown */}
            <div
              className={`px-4 py-3 ${
                userType === "admin"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600"
              }`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  {userType === "admin" ? (
                    <Shield className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">Meu Perfil</p>
                  <p className="text-white text-opacity-80 text-xs">
                    Modo: {userType === "cliente" ? "Cliente" : "Administrador"}
                  </p>
                </div>
              </div>
            </div>

            {/* Alternador de modo */}
            <div className="px-4 py-3 border-b border-gray-100">
              <button
                onClick={toggleUserType}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    Alternar para {userType === "cliente" ? "Admin" : "Cliente"}
                  </span>
                </div>
                <div
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    userType === "admin" ? "bg-purple-500" : "bg-gray-300"
                  }`}>
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      userType === "admin" ? "translate-x-6" : "translate-x-0"
                    }`}></div>
                </div>
              </button>
            </div>

            {/* Opções do Cliente */}
            {userType === "cliente" && (
              <div className="py-2">
                <button
                  onClick={() => handleNavigation("minha-conta")}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                  <User className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-sm text-gray-700 font-medium">Minha Conta</span>
                    <p className="text-xs text-gray-500">Dados pessoais e configurações</p>
                  </div>
                </button>

                <button
                  onClick={() => handleNavigation("minhas-compras")}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                  <ShoppingBag className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-sm text-gray-700 font-medium">Minhas Compras</span>
                    <p className="text-xs text-gray-500">Histórico de participações</p>
                  </div>
                </button>
              </div>
            )}

            {/* Opções do Admin */}
            {userType === "admin" && (
              <div className="py-2">
                <button
                  onClick={() => handleNavigation("admin")}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-purple-50 transition-colors text-left">
                  <Settings className="w-4 h-4 text-purple-500" />
                  <div>
                    <span className="text-sm text-gray-700 font-medium">Painel Admin</span>
                    <p className="text-xs text-gray-500">Criar e gerenciar rifas</p>
                  </div>
                </button>

                <button
                  onClick={() => handleNavigation("admin-rifas")}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-purple-50 transition-colors text-left">
                  <ShoppingBag className="w-4 h-4 text-purple-500" />
                  <div>
                    <span className="text-sm text-gray-700 font-medium">Gerenciar Rifas</span>
                    <p className="text-xs text-gray-500">Visualizar vendas e resultados</p>
                  </div>
                </button>
              </div>
            )}

            {/* Separador */}
            <div className="border-t border-gray-100"></div>

            {/* Opção de Logout */}
            <div className="py-2">
              <button
                onClick={() => handleNavigation("logout")}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors text-left">
                <LogOut className="w-4 h-4 text-red-500" />
                <div>
                  <span className="text-sm text-red-600 font-medium">Sair</span>
                  <p className="text-xs text-red-400">Desconectar da conta</p>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileButton;
