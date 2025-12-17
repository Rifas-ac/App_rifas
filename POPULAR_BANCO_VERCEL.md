# Como Popular o Banco de Dados na Vercel

Após fazer o deploy na Vercel, o banco PostgreSQL está vazio. Para adicionar as rifas:

## Opção 1: Via Terminal da Vercel (Recomendado)

1. Acesse seu projeto na Vercel
2. Vá em **Settings** > **Functions** > **Function Log Streams** (ou use o Vercel CLI)
3. Execute no terminal local:

```bash
# Instalar Vercel CLI (se não tiver)
npm i -g vercel

# Fazer login
vercel login

# Linkar o projeto
vercel link

# Popular o banco
vercel env pull .env.production
node scripts/seed-vercel.js
```

## Opção 2: Via API Route (Mais Simples)

1. Commit e push do código atualizado
2. Após o deploy, acesse no navegador:
   ```
   https://SEU-APP.vercel.app/api/admin/seed
   ```

3. Isso criará automaticamente as rifas no banco

## Opção 3: Manualmente via Prisma Studio

1. No terminal local, com as credenciais do Vercel Postgres:
   ```bash
   npx prisma studio
   ```

2. Crie manualmente as rifas:

**Rifa 1 - Gol LS 1986:**
- titulo: `Gol LS 1986`
- descricao: `Clássico dos anos 80 em excelente estado de conservação. Motor 1.6, álcool, com todos os documentos em dia.`
- premio: `Volkswagen Gol LS 1986`
- valorCota: `5.0`
- totalNumeros: `100000`
- status: `ativa`
- imagemUrl: `/rifa-gol/gol-0.png`

**Rifa 2 - Chevette DL 92:**
- titulo: `Chevette DL 92`
- descricao: `Chevrolet Chevette DL 1992, completo, ar condicionado, direção hidráulica. Um verdadeiro clássico!`
- premio: `Chevrolet Chevette DL 1992`
- valorCota: `5.0`
- totalNumeros: `100000`
- status: `em_breve`
- imagemUrl: `/rifa-Chevete/Chevete-01.jpg`

## Verificar se funcionou

Acesse: `https://SEU-APP.vercel.app/api/rifas`

Deve retornar um JSON com as 2 rifas.
