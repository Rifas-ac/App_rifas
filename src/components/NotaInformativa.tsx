import React from "react";

export default function NotaInformativa({ showNumbers }: { showNumbers: boolean }) {
  return (
    <div className="relative bg-gray-800 rounded-lg p-4 mt-4">
      {/* Botão WhatsApp no canto superior direito */}
      <a
        href="https://wa.me/5561986522088"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-2 right-2 bg-green-500 rounded-full shadow-lg flex items-center justify-center w-10 h-10 hover:bg-green-600 transition"
        title="Precisa de ajuda? Fale conosco no WhatsApp!">
        <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
          <path d="M20.52 3.48A12.07 12.07 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.56 4.18 1.62 6.01L0 24l6.25-1.62A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.23-3.48-8.52zM12 22c-1.7 0-3.37-.33-4.93-.98l-.35-.15-3.71.97.99-3.62-.18-.37A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.02-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.98 2.44.02 1.44 1.02 2.84 1.16 3.04.14.2 2.01 3.08 4.88 4.2.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.12.55-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" />
        </svg>
      </a>
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
    </div>
  );
}
