import Image from "next/image";

interface OptimizedImageDisplayProps {
  src: string;
  alt: string;
  title: string;
  description: string;
}

export function OptimizedImageDisplay({ src, alt, title, description }: OptimizedImageDisplayProps) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden max-w-sm mx-auto my-8">
      <div className="relative w-full h-64">
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          layout="fill" // Imagem preenche o contêiner pai
          objectFit="cover" // Corta a imagem para cobrir o espaço
          quality={80} // Qualidade da imagem (80%)
          priority // Carrega com alta prioridade (se estiver na primeira dobra)
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw" // Define tamanhos para diferentes viewports
          placeholder="blur" // Exibe um efeito de blur enquanto carrega
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" // Placeholder de blur (pode ser gerado automaticamente)
          className="rounded-t-lg"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-300 text-sm">{description}</p>
      </div>
    </div>
  );
}
