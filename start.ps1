# 🚀 INICIAR PROJETO - SCRIPT AUTOMATIZADO

Write-Host "🎯 Iniciando App de Rifas..." -ForegroundColor Cyan
Write-Host ""

# Verificar se o banco está configurado
if (!(Test-Path "prisma/dev.db") -and $env:DATABASE_URL -notlike "*postgresql*") {
    Write-Host "⚠️  Banco de dados não encontrado!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Escolha uma opção:" -ForegroundColor White
    Write-Host "1️⃣  SQLite (fácil, não precisa instalar nada)"
    Write-Host "2️⃣  PostgreSQL (já tenho instalado)"
    Write-Host ""
    $escolha = Read-Host "Digite 1 ou 2"
    
    if ($escolha -eq "1") {
        Write-Host ""
        Write-Host "✅ Configurando SQLite..." -ForegroundColor Green
        
        # Backup do schema
        Copy-Item "prisma/schema.prisma" "prisma/schema.prisma.backup"
        
        # Atualizar para SQLite
        (Get-Content "prisma/schema.prisma") -replace 'provider = "postgresql"', 'provider = "sqlite"' | Set-Content "prisma/schema.prisma"
        (Get-Content ".env") -replace 'DATABASE_URL="postgresql.*"', 'DATABASE_URL="file:./dev.db"' | Set-Content ".env"
        
        Write-Host "✅ SQLite configurado!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📦 Gerando Prisma Client..." -ForegroundColor Cyan
        npx prisma generate
        
        Write-Host ""
        Write-Host "🗄️  Criando banco de dados..." -ForegroundColor Cyan
        npx prisma migrate dev --name init
        
        Write-Host ""
        Write-Host "🌱 Populando banco com rifas de exemplo..." -ForegroundColor Cyan
        node prisma/seed_rifas.js
    }
    elseif ($escolha -eq "2") {
        Write-Host ""
        Write-Host "⚠️  Configure o PostgreSQL no arquivo .env primeiro!" -ForegroundColor Yellow
        Write-Host "Exemplo: DATABASE_URL='postgresql://postgres:senha@localhost:5432/rifas_db'" -ForegroundColor White
        Write-Host ""
        Read-Host "Pressione Enter depois de configurar"
        
        Write-Host ""
        Write-Host "📦 Gerando Prisma Client..." -ForegroundColor Cyan
        npx prisma generate
        
        Write-Host ""
        Write-Host "🗄️  Executando migrações..." -ForegroundColor Cyan
        npx prisma migrate dev
        
        Write-Host ""
        Write-Host "🌱 Populando banco com rifas de exemplo..." -ForegroundColor Cyan
        node prisma/seed_rifas.js
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host ""
Write-Host "🚀 Iniciando servidor Next.js..." -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 Acesse: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host ""

npm run dev
