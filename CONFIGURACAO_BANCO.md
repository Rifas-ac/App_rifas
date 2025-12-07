# 🗄️ CONFIGURAÇÃO DO BANCO DE DADOS

## Opção 1: PostgreSQL (Recomendado para Produção)

### Se você JÁ TEM PostgreSQL instalado:

1. Abra o pgAdmin ou seu cliente PostgreSQL
2. Crie um banco chamado `rifas_db`
3. Copie suas credenciais

No `.env`, substitua:
```env
DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/rifas_db"
```

**Exemplo:**
```env
DATABASE_URL="postgresql://postgres:admin123@localhost:5432/rifas_db"
```

### Se você NÃO TEM PostgreSQL:

**Instalar PostgreSQL:**
1. Baixe: https://www.postgresql.org/download/windows/
2. Instale (anote a senha do postgres)
3. Crie o banco `rifas_db`

**OU use a Opção 2 (SQLite - mais fácil!)**

---

## Opção 2: SQLite (Mais Fácil - SEM INSTALAÇÃO!)

SQLite é um banco de dados em arquivo, não precisa instalar servidor!

### Passo a passo:

1. **Edite `prisma/schema.prisma`:**

Mude de:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Para:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

2. **Edite `.env`:**

Mude de:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/rifas_db"
```

Para:
```env
DATABASE_URL="file:./dev.db"
```

3. **Execute:**
```powershell
npx prisma generate
npx prisma migrate dev --name init
```

**PRONTO! Banco criado em `prisma/dev.db`** ✅

---

## 🎯 Qual você prefere?

- **PostgreSQL**: Melhor para produção, mas precisa instalar
- **SQLite**: Mais fácil, não precisa instalar nada, perfeito para desenvolvimento

**Me diga qual você quer e eu configuro para você!**
