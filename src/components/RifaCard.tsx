import React, { useState, useEffect } from "react";
import { ShoppingCart, Minus, Plus, Trophy } from "lucide-react";
import FormularioCheckout from "./FormularioCheckout";
import QRCodeDisplay from "./QrCodeDisplay";

interface RifaCardProps {
  rifa: {
    id: string;
    titulo: string;
    descricao: string;
    valorNumero: number;
    imagem?: string;
    dataEncerramento: string;
  };
  usuario?: {
    id: string;
    nome: string;
    email: string;
  };
}

interface DadosCheckout {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
}

interface ResponseCheckout {
  qrCode: string;
  pixCopiaECola: string;
  transactionId: string;
}

const RifaCard: React.FC<RifaCardProps> = ({ rifa, usuario }) => {
  const [quantidade, setQuantidade] = useState(3);
  const [etapa, setEtapa] = useState<"selecao" | "checkout" | "pagamento" | "sucesso">("selecao");
  const [carregando, setCarregando] = useState(false);
  const [dadosCheckout, setDadosCheckout] = useState<ResponseCheckout | null>(null);
  const [numerosGerados, setNumerosGerados] = useState<number[]>([]);

  // Valores calculados
  const valorTotal = quantidade * rifa.valorNumero;
  const promocao = quantidade >= 10;
  const valorPromocional = promocao ? quantidade * rifa.valorNumero * 0.9 : null;

  const aumentarQuantidade = (valor: number) => {
    setQuantidade((prev) => prev + valor);
  };

  const diminuirQuantidade = () => {
    if (quantidade > 1) {
      setQuantidade((prev) => prev - 1);
    }
  };

  const handleQuantidadeManual = (valor: string) => {
    const num = parseInt(valor) || 1;
    setQuantidade(Math.max(1, num));
  };

  const handleParticipar = () => {
    if (!usuario) {
      // Redirecionar para login/cadastro
      window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname);
      return;
    }

    setEtapa("checkout");
  };

  const handleSubmitCheckout = async (dados: DadosCheckout) => {
    setCarregando(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rifaId: rifa.id,
          quantidade,
          dadosParticipante: dados,
          userId: usuario?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao processar checkout");
      }

      const resultado: ResponseCheckout = await response.json();
      setDadosCheckout(resultado);
      setEtapa("pagamento");
    } catch (error) {
      console.error("Erro no checkout:", error);
      alert("Erro ao processar pedido. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  const handlePagamentoConfirmado = () => {
    setEtapa("sucesso");
    // Aqui você pode buscar os números gerados da API
    gerarNumerosParticipacao();
  };

  const gerarNumerosParticipacao = async () => {
    try {
      const response = await fetch(`/api/participacoes/numeros/${dadosCheckout?.transactionId}`);
      const data = await response.json();
      setNumerosGerados(data.numeros);
    } catch (error) {
      console.error("Erro ao buscar números:", error);
    }
  };

  const renderEtapaSelecao = () => (
    <div className="max-w-md mx-auto bg-slate-800 rounded-2xl overflow-hidden shadow-2xl text-white">
      {/* Header da Rifa */}
      <div className="relative">
        {rifa.imagem && <img src={rifa.imagem} alt={rifa.titulo} className="w-full h-48 object-cover" />}
        <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">
          APENAS R$ {rifa.valorNumero.toFixed(2).replace(".", ",")}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold mb-2">{rifa.titulo}</h2>
            <p className="text-gray-300 text-sm">{rifa.descricao}</p>
          </div>
          <Trophy className="text-yellow-500 w-8 h-8 flex-shrink-0" />
        </div>

        <p className="text-xs text-gray-400 mb-4">Sorteio: Loteria Federal</p>

        {/* Botão Meus Títulos */}
        <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg mb-6 transition duration-200 flex items-center justify-center">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Meus títulos
        </button>

        {/* Promoção */}
        {promocao && (
          <div className="bg-green-700 rounded-lg p-3 mb-4">
            <p className="text-center font-bold">Promoção</p>
            <p className="text-center text-sm">Compre mais barato!</p>
            <div className="bg-green-600 rounded py-2 px-4 text-center mt-2">
              <span className="font-bold">10 por R$ {(10 * rifa.valorNumero * 0.9).toFixed(2).replace(".", ",")}</span>
            </div>
          </div>
        )}

        {/* Seleção de Quantidade */}
        <div className="mb-6">
          <h3 className="text-center font-medium mb-4">Selecione a quantidade</h3>

          {/* Botões rápidos */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[5, 10, 30, 50, 100, 300].map((num) => (
              <button
                key={num}
                onClick={() => setQuantidade(num)}
                className={`py-2 px-3 rounded text-sm font-medium transition duration-200 ${
                  quantidade === num ? "bg-orange-600 text-white" : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                }`}>
                +{num}
              </button>
            ))}
          </div>

          {/* Controle manual */}
          <div className="flex items-center justify-center bg-gray-700 rounded-lg p-2">
            <button onClick={diminuirQuantidade} className="p-2 hover:bg-gray-600 rounded transition duration-200">
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={quantidade}
              onChange={(e) => handleQuantidadeManual(e.target.value)}
              className="bg-transparent text-center text-xl font-bold w-20 focus:outline-none"
              min="1"
            />
            <button
              onClick={() => aumentarQuantidade(1)}
              className="p-2 hover:bg-gray-600 rounded transition duration-200">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Botão Participar */}
        <button
          onClick={handleParticipar}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition duration-200 shadow-lg">
          Participar R${" "}
          {valorPromocional ? valorPromocional.toFixed(2).replace(".", ",") : valorTotal.toFixed(2).replace(".", ",")}
        </button>

        {/* Informações do prêmio */}
        <div className="mt-4 p-4 bg-gray-700 rounded-lg">
          <h4 className="font-bold text-orange-500 mb-2">Prêmio dessa campanha</h4>
          <p className="text-sm text-gray-300">{rifa.titulo}</p>
          <p className="text-xs text-gray-400 mt-2">
            Os números serão gerados automaticamente e aleatoriamente após a compra
          </p>
        </div>
      </div>
    </div>
  );

  const renderEtapaSucesso = () => (
    <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 text-white text-center">
      <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-green-500 mb-4">Parabéns!</h2>
      <p className="text-gray-300 mb-6">Você está participando da rifa com {quantidade} números</p>

      {numerosGerados.length > 0 && (
        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <h3 className="font-bold mb-3">Seus números:</h3>
          <div className="grid grid-cols-5 gap-2">
            {numerosGerados.map((numero, index) => (
              <div key={index} className="bg-orange-600 rounded p-2 text-center font-bold">
                {numero.toString().padStart(4, "0")}
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setEtapa("selecao")}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200">
        Participar Novamente
      </button>
    </div>
  );

  // Renderização condicional baseada na etapa
  if (etapa === "checkout") {
    return (
      <FormularioCheckout
        onSubmit={handleSubmitCheckout}
        carregando={carregando}
        valorTotal={valorPromocional || valorTotal}
        quantidadeNumeros={quantidade}
      />
    );
  }

  if (etapa === "pagamento" && dadosCheckout) {
    return (
      <QRCodeDisplay
        qrCodeData={dadosCheckout.qrCode}
        pixCopiaECola={dadosCheckout.pixCopiaECola}
        valorTotal={valorPromocional || valorTotal}
        quantidadeNumeros={quantidade}
        onPaymentConfirmed={handlePagamentoConfirmado}
        transactionId={dadosCheckout.transactionId}
      />
    );
  }

  if (etapa === "sucesso") {
    return renderEtapaSucesso();
  }

  return renderEtapaSelecao();
};

export default RifaCard;
