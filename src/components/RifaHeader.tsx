"use client";

import type React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import AvatarMenu from "./AvatarMenu";

const images = [
  "/rifa-gol/gol-0.png",
  "/rifa-gol/gol-1.png",
  "/rifa-gol/gol-2.png",
  "/rifa-gol/gol-3.png",
  "/rifa-gol/gol-4.png",
  "/rifa-gol/gol-5.png",
  "/rifa-gol/gol-6.png",
  "/rifa-gol/gol-7.png",
  "/rifa-gol/gol-8.png",
  "/rifa-gol/gol-9.png",
  "/rifa-gol/gol-10.png",
  "/rifa-gol/gol-11.png",
  "/rifa-gol/gol-12.png",
];

const RifaHeader: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);
      }
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, setScrollSnaps, onSelect]);

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-20">
        <AvatarMenu />
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y -ml-4">
          {images.map((src, index) => (
            <div
              key={index}
              className="flex-none w-full pl-4 relative h-64 transition-transform duration-500 ease-in-out">
              <Image
                src={src || "/placeholder.svg"}
                alt={`Imagem do Gol LS 1986 ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-t-2xl"
                priority={index === 0}
                sizes="100vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Botões de Navegação */}
      <button
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10 hover:bg-black/70 transition-colors"
        onClick={scrollPrev}
        aria-label="Imagem anterior">
        <ArrowLeft className="w-6 h-6" />
      </button>
      <button
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10 hover:bg-black/70 transition-colors"
        onClick={scrollNext}
        aria-label="Próxima imagem">
        <ArrowRight className="w-6 h-6" />
      </button>

      {/* Indicadores de Posição (Dots) */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === selectedIndex ? "bg-white" : "bg-gray-400/50"
            }`}
            onClick={() => scrollTo(index)}
            aria-label={`Ir para a imagem ${index + 1}`}
          />
        ))}
      </div>

      {/* Overlay gradiente sobre a imagem */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Informações sobrepostas na imagem */}
      <div className="absolute bottom-4 left-4 right-4">
        <h2 className="text-xl font-bold text-white mb-1">Gol LS 1986 Pode Ser Sua</h2>
        <p className="text-sm text-gray-300">Sorteio: Loteria Federal</p>
      </div>

      {/* Badge de Preço */}
      <div
        className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold text-white bg-orange-500">
        APENAS R$ 3,99 🔥
      </div>
    </div>
  );
};

export default RifaHeader;