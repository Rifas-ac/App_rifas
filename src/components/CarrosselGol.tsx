"use client";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const carros = [
  { id: 0, nome: "Gol 0", imagem: "/rifa-gol/gol-0.png" },
  { id: 1, nome: "Gol 1", imagem: "/rifa-gol/gol-1.png" },
  { id: 2, nome: "Gol 2", imagem: "/rifa-gol/gol-2.png" },
  { id: 3, nome: "Gol 3", imagem: "/rifa-gol/gol-3.png" },
  { id: 4, nome: "Gol 4", imagem: "/rifa-gol/gol-4.png" },
  { id: 5, nome: "Gol 5", imagem: "/rifa-gol/gol-5.png" },
  { id: 6, nome: "Gol 6", imagem: "/rifa-gol/gol-6.png" },
  { id: 7, nome: "Gol 7", imagem: "/rifa-gol/gol-7.png" },
  { id: 8, nome: "Gol 8", imagem: "/rifa-gol/gol-8.png" },
  { id: 9, nome: "Gol 9", imagem: "/rifa-gol/gol-9.png" },
  { id: 10, nome: "Gol 10", imagem: "/rifa-gol/gol-10.png" },
  { id: 11, nome: "Gol 11", imagem: "/rifa-gol/gol-11.png" },
  { id: 12, nome: "Gol 12", imagem: "/rifa-gol/gol-12.png" },
];

export default function CarrosselGol() {
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  // Estado para saber se está logado
  const [usuarioLogado, setUsuarioLogado] = useState(false);

  useEffect(() => {
    // Exemplo: verifica se existe um token no localStorage
    setUsuarioLogado(!!localStorage.getItem("usuarioLogado"));
  }, []);

  useEffect(() => {
    if (emblaApi) emblaApi.scrollTo(0);
  }, [emblaApi]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  // Sempre começa na imagem zero
  useEffect(() => {
    if (emblaApi) {
      emblaApi.scrollTo(0);
      setSelectedIndex(0);
      emblaApi.on("select", () => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi]);

  // Passa automaticamente a cada 5 segundos
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <div className="relative w-full max-w-lg mx-auto h-64">
      {/* Bolinha de cadastro/login no canto superior esquerdo */}
      <button
        className={`absolute top-4 left-4 ${
          usuarioLogado ? "bg-green-600" : "bg-blue-600"
        } text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-20`}
        onClick={() => router.push("/cliente")}
        title="Cadastro/Login"
        type="button"
      >
        {/* Ícone de usuário */}
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" fill="white" />
          <rect x="6" y="16" width="12" height="4" rx="2" fill="white" />
        </svg>
      </button>
      {/* Carrossel */}
      <div className="overflow-hidden rounded-t-2xl h-64" ref={emblaRef}>
        <div className="embla__container flex flex-row h-64">
          {carros.map((carro) => (
            <div className="embla__slide min-w-0 flex-[0_0_100%] relative h-64" key={carro.id}>
              <Image src={carro.imagem} alt={carro.nome} fill className="object-cover" sizes="100vw" />
            </div>
          ))}
        </div>
      </div>
      {/* Botões de navegação */}
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 z-10"
        onClick={scrollPrev}
        aria-label="Anterior"
        type="button">
        ◀
      </button>
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 z-10"
        onClick={scrollNext}
        aria-label="Próxima"
        type="button">
        ▶
      </button>
      {/* Bolinhas de navegação - menores e mais embaixo */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-1 z-10">
        {carros.map((_, idx) => (
          <span
            key={idx}
            className={`w-2 h-2 rounded-full transition-all ${selectedIndex === idx ? "bg-blue-700" : "bg-white/60"}`}
            style={{
              border: selectedIndex === idx ? "1.5px solid #2563eb" : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Instalação da dependência necessária
// npm install embla-carousel-react
