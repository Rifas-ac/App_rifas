import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma"; // ajuste o caminho conforme seu projeto

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  // Gera código de 5 dígitos
  const codigo = Math.floor(10000 + Math.random() * 90000).toString();

  // Salva o código no banco (tabela usuario, campo resetCode e resetCodeExpires)
  const user = await prisma.usuario.update({
    where: { email },
    data: {
      resetCode: codigo,
      resetCodeExpires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
    },
  }).catch(() => null);

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  // Envia o código por e-mail
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "no-reply@seudominio.com",
    to: email,
    subject: "Código para troca de senha",
    html: `<p>Seu código de recuperação de senha é: <b>${codigo}</b></p>`,
  });

  return NextResponse.json({ ok: true });
}
