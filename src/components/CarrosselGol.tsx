"use client";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useEffect } from "react";

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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  // Sempre começa pela imagem zero ao montar o componente
  useEffect(() => {
    if (emblaApi) {
      emblaApi.scrollTo(0);
    }
  }, [emblaApi]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <div className="relative w-full max-w-lg mx-auto h-64">
      <div className="overflow-hidden rounded-t-2xl h-64" ref={emblaRef}>
        <div className="embla__container flex flex-row h-64">
          {carros.map((carro) => (
            <div className="embla__slide min-w-0 flex-[0_0_100%] relative h-64" key={carro.id}>
              <Image src={carro.imagem} alt={carro.nome} fill className="object-cover" sizes="100vw" />
            </div>
          ))}
        </div>
      </div>
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
    </div>
  );
}

// Instalação da dependência necessária
// npm install embla-carousel-react
