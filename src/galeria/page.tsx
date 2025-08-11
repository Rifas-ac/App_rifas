"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const images = [
  "/images/rifa-gol/gol-0.jpeg",
  "/images/rifa-gol/gol-2.jpeg",
  "/images/rifa-gol/gol-3.jpeg",
  "/images/rifa-gol/gol-4.jpeg",
  "/images/rifa-gol/gol-5.jpeg",
  "/images/rifa-gol/gol-6.jpeg",
  "/images/rifa-gol/gol-7.jpeg",
  "/images/rifa-gol/gol-8.jpeg",
  "/images/rifa-gol/gol-9.jpeg",
  "/images/rifa-gol/gol-11.jpeg",
];

export default function GaleriaPage() {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header com botão voltar */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/"
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Voltar para a página inicial">
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Galeria de Fotos do Gol LS 1986</h1>
        </div>

        {/* Grid de Imagens */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((src, index) => (
            <div
              key={index}
              className="relative w-full h-48 rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => handleImageClick(src)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleImageClick(src);
                }
              }}
              aria-label={`Ver imagem ${index + 1} em tamanho maior`}>
              <Image
                src={src || "/placeholder.svg"}
                alt={`Gol LS 1986 - Imagem ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-lg font-semibold">Ver Detalhes</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de Visualização de Imagem */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[800px] p-0 border-none bg-transparent">
            <div className="relative w-full h-[calc(100vh-80px)] max-h-[800px]">
              <Image
                src={selectedImage || "/placeholder.svg"}
                alt="Imagem em destaque"
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            </div>
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 z-20"
              aria-label="Fechar galeria de imagens">
              <X className="w-6 h-6" />
            </button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
