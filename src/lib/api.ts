import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
});

export async function buscarUsuarioLogado() {
  // Implemente a lógica para buscar o usuário logado (ex: da sessão, cookie, etc.)
  // Adapte conforme sua autenticação
  const res = await fetch("/api/usuario"); // Rota que retorna o usuário logado
  if (!res.ok) {
    throw new Error("Falha ao buscar usuário");
  }
  return res.json();
}
