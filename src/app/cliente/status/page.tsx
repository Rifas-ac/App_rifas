import { cookies } from "next/headers";

async function getTickets() {
  const userCookie = cookies().get("userEmail");
  const userEmail = userCookie ? userCookie.value : null;

  if (!userEmail) {
    // Handle the case where the user is not logged in
    return [];
  }

  // In a real application, you would fetch from a real API endpoint
  const res = await fetch(`http://localhost:3000/api/cliente/tickets?user=${userEmail}`);

  if (!res.ok) {
    // Handle the error case
    console.error("Failed to fetch tickets");
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
              tickets.map((ticket, index) => (
                <tr key={index}>
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
