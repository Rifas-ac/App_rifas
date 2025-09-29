import { z } from "zod";

/**
 * Utilitários de validação para formulários
 */

// Validação de CPF
export function limparCPF(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

export function formatarCPF(cpf: string): string {
  const apenasNumeros = limparCPF(cpf);
  return apenasNumeros
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
}

export function validarCPF(cpf: string): boolean {
  const cpfLimpo = limparCPF(cpf);

  if (cpfLimpo.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += Number.parseInt(cpfLimpo.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== Number.parseInt(cpfLimpo.charAt(9))) return false;

  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += Number.parseInt(cpfLimpo.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== Number.parseInt(cpfLimpo.charAt(10))) return false;

  return true;
}

// Validação de Email
export function validarEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function validarDominioEmail(email: string): boolean {
  const dominiosProibidos = ["tempmail.com", "10minutemail.com", "guerrillamail.com"];
  const dominio = email.split("@")[1]?.toLowerCase();
  return dominio ? !dominiosProibidos.includes(dominio) : false;
}

// Validação de Telefone
export function limparTelefone(telefone: string): string {
  return telefone.replace(/\D/g, "");
}

export function formatarTelefone(telefone: string): string {
  const apenasNumeros = limparTelefone(telefone);
  if (apenasNumeros.length <= 10) {
    return apenasNumeros.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  } else {
    return apenasNumeros.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
  }
}

export function validarTelefone(telefone: string): boolean {
  const telefoneLimpo = limparTelefone(telefone);
  return telefoneLimpo.length >= 10 && telefoneLimpo.length <= 11;
}

// Validação de Nome
export function validarNome(nome: string): boolean {
  const nomeRegex = /^[a-zA-ZÀ-ÿ\s]{2,50}$/;
  return nomeRegex.test(nome.trim());
}

// Validação de Valor
export function validarValor(valor: number): boolean {
  return valor > 0 && Number.isFinite(valor);
}

// Mensagens de erro específicas
export function obterMensagemErroCPF(cpf: string): string | null {
  if (!cpf || cpf.trim() === "") return "CPF é obrigatório";

  const cpfLimpo = limparCPF(cpf);
  if (cpfLimpo.length < 11) return "CPF deve ter 11 dígitos";
  if (cpfLimpo.length > 11) return "CPF deve ter exatamente 11 dígitos";
  if (/^(\d)\1{10}$/.test(cpfLimpo)) return "CPF não pode ter todos os dígitos iguais";
  if (!validarCPF(cpf)) return "CPF inválido";

  return null;
}

export function obterMensagemErroEmail(email: string): string | null {
  if (!email || email.trim() === "") return "Email é obrigatório";
  if (!validarEmail(email)) return "Formato de email inválido";
  if (!validarDominioEmail(email)) return "Domínio de email não permitido";

  return null;
}

export function obterMensagemErroTelefone(telefone: string): string | null {
  if (!telefone || telefone.trim() === "") return "Telefone é obrigatório";
  if (!validarTelefone(telefone)) return "Telefone deve ter entre 10 e 11 dígitos";

  return null;
}

export function obterMensagemErroNome(nome: string): string | null {
  if (!nome || nome.trim() === "") return "Nome é obrigatório";
  if (nome.trim().length < 2) return "Nome deve ter pelo menos 2 caracteres";
  if (nome.trim().length > 50) return "Nome deve ter no máximo 50 caracteres";
  if (!validarNome(nome)) return "Nome deve conter apenas letras e espaços";

  return null;
}

export const checkoutSchema = z.object({
  rifaId: z.number(),
  quantidade: z.number().min(1),
});
