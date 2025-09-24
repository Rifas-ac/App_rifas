import { NextRequest, NextResponse } from 'next/server';

// Esta função de middleware será executada para cada rota definida no 'matcher'.
export function middleware(request: NextRequest) {
  console.log('Middleware executing...');
  console.log('ADMIN_USERNAME from env:', process.env.ADMIN_USERNAME);
  console.log('ADMIN_PASSWORD from env:', process.env.ADMIN_PASSWORD);

  // 1. Obtém as credenciais das variáveis de ambiente.
  const basicAuthUser = process.env.ADMIN_USERNAME;
  const basicAuthPass = process.env.ADMIN_PASSWORD;

  // 2. Obtém o header 'Authorization' da requisição.
  const authHeader = request.headers.get('authorization');

  // 3. Se o header de autorização existir...
  if (authHeader) {
    console.log('Auth header found:', authHeader);
    const auth = authHeader.split(' ')[1];
    const decodedAuth = Buffer.from(auth, 'base64').toString('ascii');
    console.log('Decoded auth:', decodedAuth);
    const [user, pass] = decodedAuth.split(':');
    console.log('User from header:', user);
    console.log('Pass from header:', pass);

    // 4. Compara as credenciais fornecidas com as credenciais do .env.
    if (user === basicAuthUser && pass === basicAuthPass) {
      // Se as credenciais estiverem corretas, permite que a requisição continue.
      return NextResponse.next();
    }
  }

  // 5. Se não houver header ou se as credenciais estiverem erradas,
  // retorna uma resposta 401 Unauthorized.
  return new NextResponse('Auth required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"'
    }
  });
}

// O 'matcher' define quais rotas serão protegidas por este middleware.
// Neste caso, todas as rotas que começam com '/admin'.
export const config = {
  matcher: '/api/admin/:path*'
};
