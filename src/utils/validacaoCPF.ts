/**
 * Remove caracteres não numéricos do CPF
 */
export function limparCPF(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

/**
 * Formata o CPF com pontos e hífen
 */
export function formatarCPF(cpf: string): string {
  const apenasNumeros = limparCPF(cpf);
  return apenasNumeros
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
}

/**
 * Valida se o CPF é válido usando o algoritmo oficial
 */
export function validarCPF(cpf: string): boolean {
  const cpfLimpo = limparCPF(cpf);

  // Verifica se tem 11 dígitos
  if (cpfLimpo.length !== 11) {
    return false;
  }

  // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(cpfLimpo)) {
    return false;
  }

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

/**
 * Retorna uma mensagem de erro específica para o CPF
 */
export function obterMensagemErroCPF(cpf: string): string | null {
  const cpfLimpo = limparCPF(cpf);

  if (!cpf || cpf.trim() === "") {
    return "CPF é obrigatório";
  }

  if (cpfLimpo.length < 11) {
    return "CPF deve ter 11 dígitos";
  }

  if (cpfLimpo.length > 11) {
    return "CPF deve ter exatamente 11 dígitos";
  }

  if (/^(\d)\1{10}$/.test(cpfLimpo)) {
    return "CPF não pode ter todos os dígitos iguais";
  }

  if (!validarCPF(cpf)) {
    return "CPF inválido";
  }

  return null;
}
