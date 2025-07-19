import React, { useState, useEffect } from "react";
import { Copy, CheckCircle, Clock, QrCode } from "lucide-react";

interface QRCodeDisplayProps {
  qrCodeData: string;
  pixCopiaECola: string;
  valorTotal: number;
  quantidadeNumeros: number;
  onPaymentConfirmed: () => void;
  transactionId: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  qrCodeData,
  pixCopiaECola,
  valorTotal,
  quantidadeNumeros,
  onPaymentConfirmed,
  transactionId,
}) => {
  const [copiado, setCopiado] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(600); // 10 minutos
  const [statusPagamento, setStatusPagamento] = useState<"pending" | "processing" | "confirmed">("pending");

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Verificar status do pagamento
  useEffect(() => {
    const verificarPagamento = async () => {
      try {
        const response = await fetch(`/api/checkout/status/${transactionId}`);
        const data = await response.json();

        if (data.status === "approved") {
          setStatusPagamento("confirmed");
          onPaymentConfirmed();
        }
      } catch (error) {
        console.error("Erro ao verificar pagamento:", error);
      }
    };

    // Verificar a cada 5 segundos
    const interval = setInterval(verificarPagamento, 5000);

    return () => clearInterval(interval);
  }, [transactionId, onPaymentConfirmed]);

  const copiarPixCopiaECola = async () => {
    try {
      await navigator.clipboard.writeText(pixCopiaECola);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    } catch (error) {
      console.error("Erro ao copiar:", error);
    }
  };

  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (statusPagamento === "confirmed") {
    return (
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 text-white text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-green-500 mb-2">Pagamento Confirmado!</h2>
        <p className="text-gray-300 mb-4">Sua participação foi registrada com sucesso</p>
        <div className="bg-gray-700 rounded p-4">
          <p className="text-lg font-bold">{quantidadeNumeros} números adquiridos</p>
          <p className="text-green-500">Seus números serão exibidos em breve</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 text-white">
      {/* Header */}
      <div className="text-center mb-6">
        <QrCode className="w-8 h-8 text-orange-500 mx-auto mb-2" />
        <h2 className="text-xl font-bold mb-2">Efetue o Pagamento</h2>
        <div className="bg-gray-700 rounded p-3">
          <p className="text-sm text-gray-300">Valor a pagar</p>
          <p className="text-2xl font-bold text-green-500">R$ {valorTotal.toFixed(2).replace(".", ",")}</p>
          <p className="text-sm text-orange-500">{quantidadeNumeros} números</p>
        </div>
      </div>

      {/* Timer */}
      <div className="bg-orange-600 rounded p-3 mb-6 text-center">
        <Clock className="inline w-4 h-4 mr-2" />
        <span className="font-bold">Tempo restante: {formatarTempo(tempoRestante)}</span>
      </div>

      {/* QR Code */}
      <div className="bg-white p-4 rounded-lg mb-6 flex justify-center">
        <img src={`data:image/png;base64,${qrCodeData}`} alt="QR Code PIX" className="max-w-full h-auto" />
      </div>

      {/* Instruções */}
      <div className="mb-6">
        <h3 className="font-bold mb-3">Como pagar:</h3>
        <ol className="text-sm space-y-2 text-gray-300">
          <li>1. Abra o app do seu banco</li>
          <li>2. Escolha a opção PIX</li>
          <li>3. Escaneie o QR Code acima</li>
          <li>4. Confirme o pagamento</li>
        </ol>
      </div>

      {/* PIX Copia e Cola */}
      <div className="mb-6">
        <h3 className="font-bold mb-2">Ou use o PIX Copia e Cola:</h3>
        <div className="bg-gray-700 rounded p-3 break-all text-sm">{pixCopiaECola}</div>
        <button
          onClick={copiarPixCopiaECola}
          className={`w-full mt-3 py-2 px-4 rounded font-bold transition duration-200 flex items-center justify-center ${
            copiado ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
          }`}>
          {copiado ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copiar Código PIX
            </>
          )}
        </button>
      </div>

      {/* Status */}
      <div className="text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-600 text-yellow-100">
          <div className="w-2 h-2 bg-yellow-300 rounded-full mr-2 animate-pulse"></div>
          Aguardando pagamento...
        </div>
        <p className="text-xs text-gray-400 mt-2">O pagamento será confirmado automaticamente</p>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
