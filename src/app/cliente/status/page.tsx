import { cookies } from "next/headers";

async function getTickets() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("userEmail");
  const userEmail = userCookie ? userCookie.value : null;

  if (!userEmail) {
    // Lida com o caso de o usuário não estar logado
    return [];
  }

  // Constrói a URL base de forma dinâmica para funcionar em dev e prod
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
  
  const res = await fetch(`${baseUrl}/api/cliente/tickets?user=${userEmail}`);

  if (!res.ok) {
    // Lida com o caso de erro na busca
    console.error("Falha ao buscar os tickets");
    return [];
  }

  const tickets = await res.json();
  return tickets;
}

export default async function StatusPage() {
  const tickets = await getTickets();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Meus Tickets</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Rifa</th>
              <th className="px-4 py-2">Números</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length > 0 ? (
              tickets.map((ticket: { rifa: { id: number; nome: string }; numeros: string[] }) => (
                <tr key={ticket.rifa.id}>
                  <td className="border px-4 py-2">{ticket.rifa.nome}</td>
                  <td className="border px-4 py-2">{ticket.numeros.join(", ")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="border px-4 py-2 text-center">
                  Você ainda não comprou nenhum ticket.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
