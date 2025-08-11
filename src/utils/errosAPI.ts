/**
 * Utilitários para tratamento de erros da API
 */

export interface ErroAPI {
  codigo: string;
  mensagem: string;
  detalhes?: string;
  sugestao?: string;
}

export function interpretarErroMercadoPago(error: any): ErroAPI {
  // Erros específicos do Mercado Pago
  const codigoErro = error.response?.data?.cause?.[0]?.code || error.response?.data?.error || "ERRO_DESCONHECIDO";

  switch (codigoErro) {
    case "cc_rejected_insufficient_amount":
      return {
        codigo: "SALDO_INSUFICIENTE",
        mensagem: "Cartão sem saldo suficiente",
        sugestao: "Verifique o saldo do seu cartão ou use outro cartão",
      };

    case "cc_rejected_bad_filled_card_number":
      return {
        codigo: "NUMERO_CARTAO_INVALIDO",
        mensagem: "Número do cartão inválido",
        sugestao: "Verifique se o número do cartão foi digitado corretamente",
      };

    case "cc_rejected_bad_filled_date":
      return {
        codigo: "DATA_INVALIDA",
        mensagem: "Data de vencimento inválida",
        sugestao: "Verifique a data de vencimento do cartão",
      };

    case "cc_rejected_bad_filled_security_code":
      return {
        codigo: "CVV_INVALIDO",
        mensagem: "Código de segurança inválido",
        sugestao: "Verifique o código de segurança (CVV) do cartão",
      };

    case "cc_rejected_call_for_authorize":
      return {
        codigo: "AUTORIZACAO_NECESSARIA",
        mensagem: "Pagamento rejeitado pelo banco",
        sugestao: "Entre em contato com seu banco para autorizar a transação",
      };

    case "cc_rejected_card_disabled":
      return {
        codigo: "CARTAO_DESABILITADO",
        mensagem: "Cartão desabilitado",
        sugestao: "Entre em contato com seu banco ou use outro cartão",
      };

    case "cc_rejected_duplicated_payment":
      return {
        codigo: "PAGAMENTO_DUPLICADO",
        mensagem: "Pagamento duplicado detectado",
        sugestao: "Aguarde alguns minutos antes de tentar novamente",
      };

    case "cc_rejected_high_risk":
      return {
        codigo: "ALTO_RISCO",
        mensagem: "Pagamento rejeitado por segurança",
        sugestao: "Tente novamente em alguns minutos ou use outro cartão",
      };

    default:
      return {
        codigo: "ERRO_PAGAMENTO",
        mensagem: "Erro ao processar pagamento",
        detalhes: error.response?.data?.message || error.message,
        sugestao: "Tente novamente ou entre em contato com o suporte",
      };
  }
}

export function interpretarErroRede(error: any): ErroAPI {
  if (error.code === "NETWORK_ERROR" || !error.response) {
    return {
      codigo: "ERRO_CONEXAO",
      mensagem: "Erro de conexão",
      sugestao: "Verifique sua conexão com a internet e tente novamente",
    };
  }

  if (error.response?.status === 429) {
    return {
      codigo: "MUITAS_TENTATIVAS",
      mensagem: "Muitas tentativas realizadas",
      sugestao: "Aguarde alguns minutos antes de tentar novamente",
    };
  }

  if (error.response?.status >= 500) {
    return {
      codigo: "ERRO_SERVIDOR",
      mensagem: "Erro interno do servidor",
      sugestao: "Tente novamente em alguns minutos",
    };
  }

  return {
    codigo: "ERRO_DESCONHECIDO",
    mensagem: "Erro inesperado",
    detalhes: error.message,
    sugestao: "Tente novamente ou entre em contato com o suporte",
  };
}
