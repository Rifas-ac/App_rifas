import React from "react";

interface NotaInformativaProps {
  showNumbers: boolean;
}

const NotaInformativa: React.FC<NotaInformativaProps> = ({ showNumbers }) => {
  return (
    <div
      className="mt-4 p-3 rounded-lg"
      style={{
        background: "#2a2a2a",
      }}>
      <p className="text-sm text-center text-gray-400">
        {showNumbers
          ? "Números gerados aleatoriamente com segurança garantida"
          : "Os números serão gerados automaticamente e aleatoriamente após a compra"}
      </p>
    </div>
  );
};

export default NotaInformativa;
