"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { MERCADO_PAGO_CONFIG } from "@/lib/mercadopago";
import {
  validarCPF,
  obterMensagemErroCPF,
  obterMensagemErroEmail,
  obterMensagemErroNome,
  limparCPF,
  validarValor,
} from "@/utils/validacoes";
import { interpretarErroMercadoPago, interpretarErroRede, type ErroAPI } from "@/utils/errosAPI";

// Importação dinâmica do SDK do Mercado Pago
let initMercadoPago: any = null;
let CardPayment: any = null;
let mercadoPagoInicializado = false;

// Função para carregar o SDK dinamicamente
const carregarSDKMercadoPago = async () => {
  try {
    if (typeof window !== "undefined" && !mercadoPagoInicializado) {
      const sdk = await import("@mercadopago/sdk-react");
      initMercadoPago = sdk.initMercadoPago;
      CardPayment = sdk.CardPayment;

      if (MERCADO_PAGO_CONFIG.publicKey) {
        initMercadoPago(MERCADO_PAGO_CONFIG.publicKey, { locale: "pt-BR" });
        mercadoPagoInicializado = true;
        console.log("✅ MercadoPago SDK carregado e inicializado");
      } else {
        throw new Error("Chave pública do Mercado Pago não configurada");
      }
    }
  } catch (error) {
    console.error("❌ Erro ao carregar SDK do Mercado Pago:", error);
    throw error;
  }
};

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
      telefone?: string;
    };
  };
}

interface EstadoValidacao {
  cpfValido: boolean;
  emailValido: boolean;
  nomeValido: boolean;
  sobrenomeValido: boolean;
  valorValido: boolean;
}

export function FormularioCartao({ valorTotal, dadosCompra }: FormularioCartaoProps) {
  const [error, setError] = useState<ErroAPI | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sdkCarregado, setSdkCarregado] = useState(false);
  const [validacao, setValidacao] = useState<EstadoValidacao>({
    cpfValido: false,
    emailValido: false,
    nomeValido: false,
    sobrenomeValido: false,
    valorValido: false,
  });
  const [tentativas, setTentativas] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);

  // Carregar SDK do Mercado Pago
  useEffect(() => {
    const inicializar = async () => {
      try {
        await carregarSDKMercadoPago();
        setSdkCarregado(true);
      } catch (error) {
        setError({
          codigo: "SDK_NAO_CARREGADO",
          mensagem: "Erro ao carregar sistema de pagamento",
          detalhes: error instanceof Error ? error.message : "Erro desconhecido",
          sugestao: "Recarregue a página ou entre em contato com o suporte",
        });
      }
    };

    inicializar();
  }, []);

  // Validar dados quando o componente carrega
  useEffect(() => {
    const novaValidacao: EstadoValidacao = {
      cpfValido: validarCPF(dadosCompra.comprador.cpf),
      emailValido: !obterMensagemErroEmail(dadosCompra.comprador.email),
      nomeValido: !obterMensagemErroNome(dadosCompra.comprador.nome),
      sobrenomeValido: !obterMensagemErroNome(dadosCompra.comprador.sobrenome),
      valorValido: validarValor(valorTotal),
    };
    setValidacao(novaValidacao);
  }, [dadosCompra, valorTotal]);

  // Bloquear após muitas tentativas
  useEffect(() => {
    if (tentativas >= 3) {
      setBloqueado(true);
      setTimeout(() => {
        setBloqueado(false);
        setTentativas(0);
      }, 300000); // 5 minutos
    }
  }, [tentativas]);

  const validarDadosCompletos = (): ErroAPI | null => {
    // Validar CPF
    const erroCPF = obterMensagemErroCPF(dadosCompra.comprador.cpf);
    if (erroCPF) {
      return {
        codigo: "CPF_INVALIDO",
        mensagem: erroCPF,
        sugestao: "Verifique se o CPF foi digitado corretamente",
      };
    }

    // Validar email
    const erroEmail = obterMensagemErroEmail(dadosCompra.comprador.email);
    if (erroEmail) {
      return {
        codigo: "EMAIL_INVALIDO",
        mensagem: erroEmail,
        sugestao: "Use um email válido e ativo",
      };
    }

    // Validar nome
    const erroNome = obterMensagemErroNome(dadosCompra.comprador.nome);
    if (erroNome) {
      return {
        codigo: "NOME_INVALIDO",
        mensagem: erroNome,
        sugestao: "Digite seu nome completo",
      };
    }

    // Validar sobrenome
    const erroSobrenome = obterMensagemErroNome(dadosCompra.comprador.sobrenome);
    if (erroSobrenome) {
      return {
        codigo: "SOBRENOME_INVALIDO",
        mensagem: erroSobrenome,
        sugestao: "Digite seu sobrenome completo",
      };
    }

    // Validar valor
    if (!validarValor(valorTotal)) {
      return {
        codigo: "VALOR_INVALIDO",
        mensagem: "Valor da transação inválido",
        sugestao: "Recarregue a página e tente novamente",
      };
    }

    return null;
  };

  const onSubmit = async (formData: any) => {
    if (bloqueado) {
      setError({
        codigo: "BLOQUEADO",
        mensagem: "Muitas tentativas realizadas",
        sugestao: "Aguarde 5 minutos antes de tentar novamente",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Validar dados do comprador
      const erroValidacao = validarDadosCompletos();
      if (erroValidacao) {
        setError(erroValidacao);
        return;
      }

      // Validar dados do formulário de pagamento
      if (!formData.token) {
        throw new Error("Token de pagamento não foi gerado");
      }

      // Preparar dados para envio
      const dadosCompradorLimpos = {
        ...dadosCompra.comprador,
        cpf: limparCPF(dadosCompra.comprador.cpf),
      };

      const payloadParaBackend = {
        ...dadosCompra,
        comprador: dadosCompradorLimpos,
        paymentData: {
          token: formData.token,
          issuer_id: formData.issuer_id,
          payment_method_id: formData.payment_method_id,
          transaction_amount: formData.transaction_amount,
          installments: formData.installments,
          payer: {
            ...formData.payer,
            identification: {
              type: "CPF",
              number: dadosCompradorLimpos.cpf,
            },
          },
        },
      };

      const response = await apiClient.post("/checkout", payloadParaBackend);

      // Tratar diferentes status de resposta
      switch (response.data.status) {
        case "approved":
          console.log("✅ Pagamento aprovado!");
          window.location.href = `/compra-aprovada?payment_id=${response.data.paymentId}`;
          break;

        case "pending":
          console.log("⏳ Pagamento pendente");
          window.location.href = `/pagamento-pendente?payment_id=${response.data.paymentId}`;
          break;

        case "rejected":
          const erroRejeicao = interpretarErroMercadoPago({ response: { data: response.data } });
          setError(erroRejeicao);
          setTentativas((prev) => prev + 1);
          break;

        default:
          throw new Error(`Status inesperado: ${response.data.status}`);
      }
    } catch (err: any) {
      console.error("❌ Erro no pagamento:", err);

      let erroInterpretado: ErroAPI;

      if (err.response?.data?.cause || err.response?.data?.error) {
        erroInterpretado = interpretarErroMercadoPago(err);
      } else {
        erroInterpretado = interpretarErroRede(err);
      }

      setError(erroInterpretado);
      setTentativas((prev) => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (error: any) => {
    console.error("❌ Erro no Card Payment Brick:", error);
    setError({
      codigo: "ERRO_FORMULARIO",
      mensagem: "Erro ao carregar formulário de pagamento",
      detalhes: error.message,
      sugestao: "Recarregue a página e tente novamente",
    });
  };

  // Se o SDK não foi carregado ainda
  if (!sdkCarregado) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando sistema de pagamento...</p>
          <p className="text-sm text-gray-500 mt-2">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  // Se não foi possível configurar o Mercado Pago
  if (!MERCADO_PAGO_CONFIG.isConfigured) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Erro de Configuração:</strong> Sistema de pagamento não configurado.
        <br />
        <small>Entre em contato com o suporte.</small>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status de Validação */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3 flex items-center">
          📋 Dados do Comprador
          {Object.values(validacao).every((v) => v) && (
            <span className="ml-2 text-green-600 text-sm">✅ Todos os dados válidos</span>
          )}
        </h3>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <span className={validacao.nomeValido ? "text-green-600" : "text-red-600"}>
              {validacao.nomeValido ? "✅" : "❌"}
            </span>
            <span className="ml-2">Nome: {dadosCompra.comprador.nome}</span>
          </div>

          <div className="flex items-center">
            <span className={validacao.sobrenomeValido ? "text-green-600" : "text-red-600"}>
              {validacao.sobrenomeValido ? "✅" : "❌"}
            </span>
            <span className="ml-2">Sobrenome: {dadosCompra.comprador.sobrenome}</span>
          </div>

          <div className="flex items-center">
            <span className={validacao.emailValido ? "text-green-600" : "text-red-600"}>
              {validacao.emailValido ? "✅" : "❌"}
            </span>
            <span className="ml-2">Email: {dadosCompra.comprador.email}</span>
          </div>

          <div className="flex items-center">
            <span className={validacao.cpfValido ? "text-green-600" : "text-red-600"}>
              {validacao.cpfValido ? "✅" : "❌"}
            </span>
            <span className="ml-2">CPF: {dadosCompra.comprador.cpf}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span>
              <strong>Quantidade:</strong> {dadosCompra.quantidade} números
            </span>
            <span>
              <strong>Total:</strong> R$ {valorTotal.toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>
      </div>

      {/* Formulário de Pagamento */}
      {valorTotal > 0 && Object.values(validacao).every((v) => v) && CardPayment ? (
        <div className="relative">
          <CardPayment
            key={`${valorTotal}-${tentativas}`}
            initialization={{ amount: valorTotal }}
            customization={{
              paymentMethods: { maxInstallments: 3 },
              visual: {
                style: {
                  theme: "default",
                },
              },
            }}
            onSubmit={onSubmit}
            onError={onError}
          />

          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg z-10">
              <div className="bg-white p-6 rounded-lg flex items-center gap-3 shadow-lg max-w-sm">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <div>
                  <p className="font-semibold">Processando pagamento...</p>
                  <p className="text-sm text-gray-600">Validando dados e processando transação</p>
                  <p className="text-xs text-gray-500 mt-1">Não feche esta página</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <strong>Atenção:</strong> Corrija os dados inválidos antes de prosseguir com o pagamento.
        </div>
      )}

      {/* Exibição de Erros */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <div className="flex items-start">
            <span className="text-red-500 mr-2 text-lg">⚠️</span>
            <div>
              <strong>{error.mensagem}</strong>
              {error.detalhes && <p className="text-sm mt-1 text-red-600">{error.detalhes}</p>}
              {error.sugestao && (
                <p className="text-sm mt-2 bg-red-50 p-2 rounded border-l-4 border-red-300">
                  💡 <strong>Sugestão:</strong> {error.sugestao}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Informações de Segurança */}
      <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm">
        <div className="flex items-center mb-2">
          <span className="text-blue-600 mr-2">🔒</span>
          <strong className="text-blue-800">Pagamento Seguro</strong>
        </div>
        <ul className="text-blue-700 text-xs space-y-1 ml-6">
          <li>• Dados criptografados com SSL</li>
          <li>• Processado pelo Mercado Pago</li>
          <li>• Não armazenamos dados do cartão</li>
          <li>• Transação protegida por 3D Secure</li>
        </ul>
      </div>
    </div>
  );
}
