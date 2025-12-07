#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Detecta se está na Vercel ou local
const isVercel = process.env.VERCEL === '1';
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

if (isVercel) {
  console.log('🚀 Detectado ambiente Vercel - Usando PostgreSQL');

  // Lê o schema atual
  let schema = fs.readFileSync(schemaPath, 'utf8');

  // Substitui sqlite por postgresql
  schema = schema.replace(
    /provider\s*=\s*"sqlite"/g,
    'provider = "postgresql"'
  );

  // Escreve o schema atualizado
  fs.writeFileSync(schemaPath, schema);

  console.log('✅ Schema atualizado para PostgreSQL');
} else {
  console.log('💻 Ambiente local - Usando SQLite');
}
