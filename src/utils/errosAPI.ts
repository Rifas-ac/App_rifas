/**
 * Utilitários para tratamento de erros da API
 */

export interface ErroAPI {
  codigo: string;
  mensagem: string;
  detalhes?: string;
  sugestao?: string;
}

/**
 * Interpreta um erro genérico da rede (Axios) e retorna um objeto ErroAPI padronizado.
 * @param error - O objeto de erro, geralmente de uma chamada Axios.
 * @returns Um objeto ErroAPI.
 */
export function interpretarErroRede(error: any): ErroAPI {
  if (error.code === 'NETWORK_ERROR' || !error.response) {
    return {
      codigo: 'ERRO_CONEXAO',
      mensagem: 'Erro de conexão',
      sugestao: 'Verifique sua conexão com a internet e tente novamente.',
    };
  }

  const status = error.response?.status;
  const data = error.response?.data;

  if (status === 429) {
    return {
      codigo: 'MUITAS_TENTATIVAS',
      mensagem: 'Muitas tentativas realizadas',
      sugestao: 'Aguarde alguns minutos antes de tentar novamente.',
    };
  }

  if (status >= 500) {
    return {
      codigo: 'ERRO_SERVIDOR',
      mensagem: 'Erro interno do servidor',
      sugestao: 'Tente novamente em alguns minutos. Se o erro persistir, contate o suporte.',
    };
  }
  
  // Para erros 4xx (Bad Request, etc.), tenta usar a mensagem da API
  if (data?.message) {
    return {
        codigo: 'ERRO_CLIENTE',
        mensagem: data.message,
        sugestao: 'Verifique os dados enviados e tente novamente.',
      };
  }

  return {
    codigo: 'ERRO_DESCONHECIDO',
    mensagem: 'Ocorreu um erro inesperado',
    detalhes: error.message,
    sugestao: 'Tente novamente ou entre em contato com o suporte.',
  };
}
