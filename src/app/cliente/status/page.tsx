import { cookies } from "next/headers";

interface TicketGroup {
  rifa: {
    id: number;
    nome: string;
  };
  numeros: string[];
}

interface UserData {
  nome: string;
  // Adicione outros campos do usuário se necessário
}

async function getTickets(userEmail: string): Promise<TicketGroup[]> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
  
  const res = await fetch(`${baseUrl}/api/cliente/tickets?user=${userEmail}`, { cache: "no-store" });

  if (!res.ok) {
    const errorData = await res.json();
    console.error("Falha ao buscar os tickets:", res.status, errorData);
    return [];
  }

  const tickets = await res.json();
  return tickets;
}

async function getUserData(userEmail: string): Promise<UserData | null> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/cliente/user?email=${userEmail}`, { cache: "no-store" });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Falha ao buscar dados do usuário:", res.status, errorData);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return null;
  }
}

export default async function StatusPage() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("userEmail");
  const userEmail = userCookie ? userCookie.value : null;

  console.log("userCookie in StatusPage:", userCookie);
  console.log("userEmail in StatusPage:", userEmail);

  if (!userEmail) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Você precisa estar logado para ver seus tickets.</p>
      </div>
    );
  }

  const [tickets, userData] = await Promise.all([
    getTickets(userEmail),
    getUserData(userEmail),
  ]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 text-gray-800">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">Meus Tickets</h1>
        {userData && <p className="text-xl text-center mb-4">Olá, {userData.nome}!</p>}

        {tickets.length > 0 ? (
          <div className="space-y-4">
            {tickets.map((ticketGroup) => (
              <div key={ticketGroup.rifa.id} className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                <h2 className="text-xl font-semibold text-blue-600">Rifa: {ticketGroup.rifa.nome}</h2>
                <p><strong>Seus Números:</strong> {ticketGroup.numeros.join(", ")}</p>
                {/* "Concurso" is not directly available in the current data structure. 
                    Assuming "Rifa" itself is the contest for now. */}
                <p><strong>Concurso:</strong> {ticketGroup.rifa.nome}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-600">Você ainda não comprou nenhum ticket.</p>
        )}
      </div>
    </div>
  );
}