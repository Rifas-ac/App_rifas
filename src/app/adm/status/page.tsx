import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface Comprador {
  nome: string;
  sobrenome: string;
  cpf: string;
  telefone: string;
  email: string;
  ticketsComprados: string[];
}

interface RifaData {
  rifa: {
    id: number;
    titulo: string;
  };
  compradores: Comprador[];
}

async function getAdminRifaData(): Promise<RifaData | null> {
  const cookieStore = cookies();
  const userType = cookieStore.get("userType");

  if (userType?.value !== "admin") {
    redirect("/"); // Redireciona se não for admin
  }

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/admin/rifas/active/buyers`, {
      headers: {
        // Adicione as credenciais de autenticação básica se necessário
        // 'Authorization': `Basic ${btoa(`${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`)}`
      },
      cache: "no-store", // Garante que os dados sejam sempre atualizados
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Falha ao buscar dados da rifa ativa para admin:", res.status, errorData);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Erro ao buscar dados da rifa ativa para admin:", error);
    return null;
  }
}

export default async function AdminStatusPage() {
  const rifaData = await getAdminRifaData();

  if (!rifaData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Nenhuma rifa ativa ou erro ao carregar dados.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 text-gray-800">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">Administração da Rifa: {rifaData.rifa.titulo}</h1>

        {rifaData.compradores.length === 0 ? (
          <p className="text-center text-lg text-gray-600">Nenhum comprador ainda para esta rifa.</p>
        ) : (
          <div className="space-y-6">
            {rifaData.compradores.map((comprador, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                <h2 className="text-xl font-semibold text-blue-600 mb-2">Comprador: {comprador.nome} {comprador.sobrenome}</h2>
                <p><strong>Email:</strong> {comprador.email}</p>
                <p><strong>CPF:</strong> {comprador.cpf}</p>
                <p><strong>Telefone:</strong> {comprador.telefone}</p>
                <p className="mt-2"><strong>Tickets Comprados:</strong> {comprador.ticketsComprados.join(", ")}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
