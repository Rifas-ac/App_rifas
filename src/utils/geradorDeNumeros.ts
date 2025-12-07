import { Prisma } from '@prisma/client';

function pad(num: number, size: number): string {
  let s = num.toString();
  while (s.length < size) s = '0' + s;
  return s;
}

/**
 * Gera uma quantidade de números aleatórios únicos de 6 dígitos para uma rifa específica.
 * @param tx - O cliente de transação do Prisma para garantir a atomicidade.
 * @param quantidade - A quantidade de números a serem gerados.
 * @param rifaId - O ID da rifa para verificar a unicidade.
 * @returns Uma promessa que resolve para um array de strings com os números gerados.
 */

export async function geradorDeNumeros(
  tx: Prisma.TransactionClient,
  quantidade: number,
  rifaId: number
): Promise<string[]> {
  const numerosGerados = new Set<string>();
  const maxTentativas = quantidade * 10; // Limite de tentativas para evitar loops infinitos
  let tentativas = 0;

  while (numerosGerados.size < quantidade && tentativas < maxTentativas) {
    const numeroAleatorio = Math.floor(Math.random() * 1000000); // Gera um número aleatório de 0 a 999999
    const numeroFormatado = pad(numeroAleatorio, 6); // Formata para 6 dígitos

    // Verifica se o número já existe nesta rodada
    if (!numerosGerados.has(numeroFormatado)) {
      // Verifica se o número já existe no banco de dados para esta rifa
      const ticketExistente = await tx.ticket.findUnique({
        where: {
          rifaId_numero: {
            rifaId: rifaId,
            numero: numeroFormatado
          }
        }
      });

      if (!ticketExistente) {
        numerosGerados.add(numeroFormatado); // Adiciona o número se não existir
      }
    }
    tentativas++;
  }

  if (numerosGerados.size < quantidade) {
    throw new Error(`Não foi possível gerar ${quantidade} números únicos após ${tentativas} tentativas.`);
  }

  return Array.from(numerosGerados);
}

/**
 * Gera números únicos a partir de uma lista de números disponíveis
 * @param quantidade - Quantidade de números a gerar
 * @param numerosDisponiveis - Array com os números disponíveis
 * @returns Array com os números escolhidos
 */
export function gerarNumerosUnicos(quantidade: number, numerosDisponiveis: number[]): number[] {
  const shuffled = [...numerosDisponiveis].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, quantidade);
}

