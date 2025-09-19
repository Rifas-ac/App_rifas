import axios from 'axios';

// URL base da API da Infinity Pay (exemplo, use a URL oficial)
const INFINITY_PAY_API_URL = 'https://api.infinitypay.io';

// Configuração do cliente Axios para a API
const apiClient = axios.create({
  baseURL: INFINITY_PAY_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.INFINITY_PAY_API_TOKEN}`,
  },
});

interface Payer {
  name: string;
  document: string; // CPF sem formatação
}

interface PixChargeData {
  value: number; // Valor em centavos (ex: 1050 para R$ 10,50)
  payer: Payer;
  external_id: string; // ID externo para sua referência (ex: checkoutSessionId)
  expires_in: number; // Tempo de expiração em segundos
}

interface PixChargeResponse {
  id: string;
  qr_code_text: string; // O famoso "copia e cola" (EMV)
  qr_code_url: string; // URL da imagem do QR Code (se a API fornecer)
  // ... outros campos que a API da Infinity Pay possa retornar
}

/**
 * Cria uma nova cobrança PIX na Infinity Pay.
 * @param data - Os dados da cobrança PIX.
 * @returns Os detalhes da cobrança PIX gerada.
 */
export async function createPixCharge(data: PixChargeData): Promise<PixChargeResponse> {
  try {
    // Linha comentada pois é uma simulação. Descomente para usar a API real.
    // const response = await apiClient.post<PixChargeResponse>('/v1/pix-charges', data);
    // return response.data;

    // --- Início do Bloco de Simulação (Remover em Produção) ---
    console.log('--- MODO DE SIMULAÇÃO: Gerando cobrança PIX falsa ---');
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula latência de rede

    const mockResponse: PixChargeResponse = {
      id: `inf_${data.external_id}`,
      qr_code_text: `00020126580014br.gov.bcb.pix0136${data.external_id}-c5a8-4c8e-a2f0-e4d3b1a8d297520400005303986540${(data.value / 100).toFixed(2).replace('.', '')}5802BR5913${data.payer.name.substring(0, 13)}6009SAO PAULO62290525${data.external_id}6304E3B2`,
      qr_code_url: '', // A URL pode ser gerada no backend usando o qr_code_text
    };

    return mockResponse;
    // --- Fim do Bloco de Simulação ---

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao criar cobrança PIX na Infinity Pay:', error.response?.data);
      // Lança um erro mais específico para ser tratado na API route
      throw new Error(error.response?.data?.message || 'Falha na comunicação com o gateway de pagamento.');
    }
    console.error('Erro inesperado ao criar cobrança PIX:', error);
    throw new Error('Ocorreu um erro inesperado ao gerar o PIX.');
  }
}
