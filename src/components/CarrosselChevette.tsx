"use client";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import AvatarMenu from "./AvatarMenu";

const carrosChevette = [
  { id: 0, nome: "Chevette 0", imagem: "/rifa-gol/gol-2.png" },
  { id: 1, nome: "Chevette 1", imagem: "/rifa-gol/gol-3.png" },
  { id: 2, nome: "Chevette 2", imagem: "/rifa-gol/gol-4.png" },
  { id: 3, nome: "Chevette 3", imagem: "/rifa-gol/gol-5.png" },
  { id: 4, nome: "Chevette 4", imagem: "/rifa-gol/gol-6.png" },
  { id: 5, nome: "Chevette 5", imagem: "/rifa-gol/gol-7.png" },
];

export default function CarrosselChevette() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      clearInterval(interval);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <div className="relative w-full max-w-lg mx-auto h-96">
      {/* AvatarMenu posicionado dentro do carrossel */}
      <div className="absolute top-4 right-4 z-20">
        <AvatarMenu />
      </div>

      {/* Carrossel */}
      <div className="overflow-hidden rounded-t-2xl h-96" ref={emblaRef}>
        <div className="embla__container flex flex-row h-96">
          {carrosChevette.map((carro) => (
            <div className="embla__slide min-w-0 flex-[0_0_100%] relative h-96" key={carro.id}>
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

      {/* Bolinhas de navegação */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-1 z-10">
        {carrosChevette.map((_, idx) => (
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
