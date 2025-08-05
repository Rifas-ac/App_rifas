import React from "react";
import AdminPage from "./AdminComponent";

// Componente da página admin
// Esta é a página principal que será acessada em /admin
export default function Admin() {
  return <AdminPage />;
}

// Metadados da página (opcional)
export const metadata = {
  title: "Admin - Painel de Controle",
  description: "Painel administrativo para gerenciar rifas",
};
