/**
 * Utilitários para tratamento de erros da API
 */

export interface ErroAPI {
  codigo: string;
  mensagem: string;
  detalhes?: string;
  sugestao?: string;
}

export function handleApiError(error: any): ErroAPI {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const status = error.response.status;
    const data = error.response.data;

    if (status === 400) {
      return {
        codigo: 'BAD_REQUEST',
        mensagem: 'Requisição inválida.',
        detalhes: data?.message || 'Os dados enviados são inválidos.',
        sugestao: 'Verifique os dados e tente novamente.',
      };
    }
    if (status === 401) {
      return {
        codigo: 'UNAUTHORIZED',
        mensagem: 'Não autorizado.',
        detalhes: data?.message || 'Você não tem permissão para realizar esta ação.',
        sugestao: 'Faça login e tente novamente.',
      };
    }
    if (status === 404) {
      return {
        codigo: 'NOT_FOUND',
        mensagem: 'Recurso não encontrado.',
        detalhes: data?.message,
        sugestao: 'Verifique o endereço e tente novamente.',
      };
    }
    if (status >= 500) {
      return {
        codigo: 'SERVER_ERROR',
        mensagem: 'Erro interno do servidor.',
        sugestao: 'Tente novamente mais tarde.',
      };
    }
  } else if (error.request) {
    // The request was made but no response was received
    return {
      codigo: 'NETWORK_ERROR',
      mensagem: 'Erro de conexão.',
      sugestao: 'Verifique sua conexão com a internet e tente novamente.',
    };
  }

  // Something happened in setting up the request that triggered an Error
  return {
    codigo: 'UNKNOWN_ERROR',
    mensagem: 'Ocorreu um erro inesperado.',
    detalhes: error.message,
    sugestao: 'Tente novamente ou entre em contato com o suporte.',
  };
}