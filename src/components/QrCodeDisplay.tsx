"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface QrCodeDisplayProps {
  qrCodeBase64: string;
  pixCode: string;
  expiresAt: string;
}

const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({ qrCodeBase64, pixCode, expiresAt }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiration = new Date(expiresAt).getTime();
      const distance = expiration - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft("Expirado");
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg text-white text-center">
      <h2 className="text-2xl font-bold mb-4">Pague com PIX</h2>
      <p className="mb-4">Escaneie o QR Code abaixo com o app do seu banco.</p>
      <div className="flex justify-center mb-4">
        <Image src={qrCodeBase64} alt="PIX QR Code" width={256} height={256} />
      </div>
      <div className="mb-4">
        <p className="text-lg font-semibold">Tempo para expirar: {timeLeft}</p>
      </div>
      <div className="space-y-2">
        <p className="text-sm">Ou use o PIX Copia e Cola:</p>
        <div className="flex items-center justify-center">
          <input type="text" value={pixCode} readOnly className="w-full p-2 text-sm text-gray-300 bg-gray-700 border border-gray-600 rounded-l-md" />
          <button onClick={handleCopy} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-r-md hover:bg-blue-700">
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrCodeDisplay;
