import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel Admin - Rifas",
  description: "Gerencie suas rifas e acompanhe as vendas",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
