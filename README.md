# 🎯 Plataforma de Rifas Online

Bem-vindo ao projeto da **Plataforma de Rifas Online**! Este documento contém tudo o que você precisa para configurar e rodar o ambiente de desenvolvimento localmente.

O projeto é totalmente containerizado com Docker, o que significa que você não precisa instalar Node.js ou PostgreSQL na sua máquina. O Docker cuida de tudo!

## 📋 Sumário

- [Pré-requisitos](#pré-requisitos)
- [Como Configurar o Ambiente](#como-configurar-o-ambiente)
- [Comandos Úteis do Dia a Dia](#comandos-úteis-do-dia-a-dia)
- [Fluxo de Trabalho com o Banco de Dados (Prisma)](#fluxo-de-trabalho-com-o-banco-de-dados-prisma)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Dúvidas Comuns (Troubleshooting)](#dúvidas-comuns-troubleshooting)

## 🔧 Pré-requisitos

Antes de começar, garanta que você tenha os seguintes softwares instalados:

- **Git** - Para controle de versão do código
- **Docker** - Para gerenciar os containers da aplicação e do banco de dados

É só isso! O Docker vai gerenciar as versões corretas do Node.js e do PostgreSQL para você.

## 🚀 Como Configurar o Ambiente

Siga estes passos para ter o projeto rodando na sua máquina pela primeira vez.

### 1. Clonar o Repositório

Abra seu terminal e clone o projeto para a sua máquina:

```bash
git clone https://github.com/SEU_USUARIO/rifa-online.git
```

### 2. Navegue para a Pasta do Projeto

```bash
cd app_rifas
```

### 3. Configure as Variáveis de Ambiente

O projeto usa um arquivo `.env` para configurar variáveis importantes, como a conexão com o banco de dados. Nós temos um arquivo de exemplo pronto.

Copie o arquivo `.env.example` para criar o seu arquivo `.env` local:

**No Windows (PowerShell):**

```powershell
copy .env.example .env
```

**No Linux ou macOS:**

```bash
cp .env.example .env
```

> 💡 **Dica:** Para o ambiente Docker, os valores que já estão no arquivo de exemplo funcionarão perfeitamente. Você não precisa alterar nada por enquanto.

### 4. Suba os Containers com Docker Compose

Este é o comando principal! Ele vai baixar as imagens necessárias, construir a imagem da nossa aplicação e iniciar tudo.

```bash
docker-compose up -d
```

> ⚠️ **Atenção:** A primeira vez que você rodar este comando pode demorar alguns minutos, pois ele precisa baixar a imagem do PostgreSQL e construir a imagem da aplicação. Nas próximas vezes, será muito mais rápido!

Você verá muitos logs no seu terminal. Deixe este terminal aberto.

### 5. Configure o Banco de Dados

Com os containers rodando, abra um novo terminal (deixe o anterior aberto) e rode o seguinte comando para criar as tabelas no banco de dados:

```bash
npx prisma db push
```

Este comando executa o `prisma db push` dentro do container da aplicação, sincronizando o seu `schema.prisma` com o banco de dados.

### 6. ✅ Pronto!

O ambiente está configurado! Abra seu navegador e acesse [http://localhost:3000](http://localhost:3000). Você deverá ver a página inicial da aplicação.

## 🛠️ Comandos Úteis do Dia a Dia

Aqui estão os comandos que você mais usará:

### Para iniciar o ambiente:

```bash
# Inicia os containers e mostra os logs no terminal
docker-compose up

# Ou, para iniciar em segundo plano (libera o terminal)
docker-compose up -d
```

### Para parar o ambiente:

```bash
# Para os containers que estão rodando em primeiro plano
Ctrl + C

# Ou, se você usou -d, para parar e remover os containers
docker-compose down
```

### Para ver os logs da aplicação (se estiver rodando em segundo plano):

```bash
docker-compose logs -f app
```

## 🗄️ Fluxo de Trabalho com o Banco de Dados (Prisma)

Qualquer alteração na estrutura do banco de dados é feita através do arquivo `prisma/schema.prisma`.

### Quando você alterar o schema.prisma:

Crie um novo arquivo de migração para registrar suas alterações. Isso é uma boa prática para manter o histórico do banco.

```bash
npx prisma migrate dev --name "nome-da-sua-migracao"
```

**Exemplo:** `... --name cria-tabela-promocoes`

Isso irá aplicar a alteração e criar um novo arquivo de migração na pasta `prisma/migrations`.

### Quando outro dev criar uma migração (e você baixar com git pull):

Você só precisa aplicar as migrações que ainda não estão no seu banco de dados.

```bash
 npx prisma migrate deploy
```

## 🔐 Variáveis de Ambiente

O arquivo `.env` é usado para configurar a aplicação. Aqui está uma descrição das variáveis:

| Variável                    | Descrição                                                                   | Exemplo no .env.example                                          |
| --------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `DATABASE_URL`              | A string de conexão completa para o banco de dados PostgreSQL               | `postgresql://devuser:devpassword@db:5432/rifa_db?schema=public` |
| `MERCADO_PAGO_ACCESS_TOKEN` | Token secreto para se comunicar com a API do Mercado Pago. **Não comitar!** | `COLOQUE_SEU_TOKEN_AQUI`                                         |
| `NEXT_PUBLIC_API_URL`       | URL pública da nossa API (usada no frontend)                                | `http://localhost:3000`                                          |

## 📁 Estrutura de Pastas

```
.
├── prisma/             # Contém o schema e as migrações do banco de dados
├── public/             # Arquivos estáticos (imagens, fontes)
├── src/
│   ├── app/            # Onde ficam as páginas e APIs do Next.js (App Router)
│   ├── components/     # Componentes React reutilizáveis (Ex: Button, Card)
│   ├── lib/            # Funções utilitárias, instância do Prisma, etc.
│   └── ...
├── .env.example        # Arquivo de exemplo para as variáveis de ambiente
└── docker-compose.yml  # Orquestrador dos nossos containers Docker
```

## ❓ Dúvidas Comuns (Troubleshooting)

### Erro de "Permission Denied" ao rodar o Docker (Linux):

**Causa:** Seu usuário não tem permissão para gerenciar o Docker.

**Solução:** Adicione seu usuário ao grupo docker com `sudo usermod -aG docker ${USER}` e reinicie sua máquina ou faça logout e login novamente.

### Erro "Port is already allocated" ou "Porta já está em uso":

**Causa:** Outro serviço na sua máquina já está usando a porta 3000 ou 5432.

**Solução:** Pare o serviço conflitante ou altere a porta no arquivo `docker-compose.yml`. Por exemplo, para usar a porta 3001 para a aplicação, mude `ports: - "3000:3000"` para `ports: - "3001:3000"`.

---

🎯 **Pronto para começar?** Siga os passos acima e você terá o ambiente rodando em poucos minutos!
