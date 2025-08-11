/**
 * Configuração centralizada do Mercado Pago
 */

// Verificar se as chaves estão configuradas
export const MERCADO_PAGO_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY,
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
  isConfigured: !!(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY && process.env.MERCADO_PAGO_ACCESS_TOKEN),
};

// Validar configuração
export function validarConfiguracaoMP(): { valido: boolean; erros: string[] } {
  const erros: string[] = [];

  if (!MERCADO_PAGO_CONFIG.publicKey) {
    erros.push("NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY não configurada");
  }

  if (!MERCADO_PAGO_CONFIG.accessToken) {
    erros.push("MERCADO_PAGO_ACCESS_TOKEN não configurada");
  }

  return {
    valido: erros.length === 0,
    erros,
  };
}

// Log de status da configuração
if (typeof window === "undefined") {
  // Apenas no servidor
  const { valido, erros } = validarConfiguracaoMP();

  if (valido) {
    console.log("✅ Mercado Pago configurado corretamente");
  } else {
    console.error("❌ Erro na configuração do Mercado Pago:");
    erros.forEach((erro) => console.error(`  - ${erro}`));
  }
}
