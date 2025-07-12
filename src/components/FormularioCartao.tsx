'use client';

import { useState } from 'react';
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';
import { apiClient } from '@/lib/api';

// A inicialização do MP é feita uma vez quando o componente é carregado.
// A chave pública é segura para ser exposta no frontend.
initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY!, { locale: 'pt-BR' });

interface FormularioCartaoProps {
  valorTotal: number;
  dadosCompra: {
    rifaId: number;
    quantidade: number;
    comprador: {
      nome: string;
      sobrenome: string;
      cpf: string;
      email: string;
      // O telefone pode ser opcional aqui
      telefone?: string;
    };
  };
}

/**
 * Componente que renderiza o formulário de pagamento com cartão (Brick)
 * e lida com a submissão e tokenização dos dados para o backend.
 */
export function FormularioCartao({ valorTotal, dadosCompra }: FormularioCartaoProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Função chamada pelo Brick ao submeter, já com os dados tokenizados.
  const onSubmit = async (formData: any) => {
    setIsLoading(true);
    setError(null);

    const payloadParaBackend = {
      ...dadosCompra,
      paymentData: {
        token: formData.token,
        issuer_id: formData.issuer_id,
        payment_method_id: formData.payment_method_id,
        transaction_amount: formData.transaction_amount,
        installments: formData.installments,
        payer: formData.payer
      }
    };

    try {
      const response = await apiClient.post('/checkout', payloadParaBackend);
      alert(`Pagamento processado! Status: ${response.data.status}`);
      // Idealmente, redirecionar para uma página de sucesso com o ID do pagamento.
      window.location.href = `/compra-aprovada?payment_id=${response.data.paymentId}`;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ocorreu um erro ao processar seu pagamento.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (error: any) => {
    // Loga erros internos do Brick, como falha de inicialização.
    console.error('Erro no Card Payment Brick:', error);
    setError('Houve um erro ao carregar o formulário de pagamento.');
  };

  return (
    <div>
      {valorTotal > 0 ? (
        <CardPayment
          key={valorTotal}
          initialization={{ amount: valorTotal }}
          customization={{ paymentMethods: { maxInstallments: 3 } }}
          onSubmit={onSubmit}
          onError={onError}
        />
      ) : (
        <p>Carregando valor...</p>
      )}

      {isLoading && <p>Processando pagamento, aguarde...</p>}
      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
    </div>
  );
}
