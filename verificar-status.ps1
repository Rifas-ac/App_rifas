# 🔍 Script para verificar status dos testes

Write-Host ""
Write-Host "🔍 VERIFICANDO STATUS DOS TESTES DO MERCADO PAGO" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Verifica se o servidor está rodando
Write-Host "📡 Verificando servidor Next.js..." -ForegroundColor Yellow
$servidorRodando = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if ($servidorRodando) {
    Write-Host "   ✅ Servidor rodando na porta 3001" -ForegroundColor Green
} else {
    Write-Host "   ❌ Servidor NÃO está rodando" -ForegroundColor Red
    Write-Host "   💡 Execute: .\iniciar-testes.ps1" -ForegroundColor Yellow
}

Write-Host ""

# Verifica se o Ngrok está rodando
Write-Host "🌐 Verificando Ngrok..." -ForegroundColor Yellow
$ngrokRodando = Get-Process -Name ngrok -ErrorAction SilentlyContinue
if ($ngrokRodando) {
    Write-Host "   ✅ Ngrok está rodando" -ForegroundColor Green
    Write-Host "   💡 Acesse http://127.0.0.1:4040 para ver a URL do Ngrok" -ForegroundColor Cyan
} else {
    Write-Host "   ❌ Ngrok NÃO está rodando" -ForegroundColor Red
    Write-Host "   💡 Execute: .\ngrok.exe http 3001 (em outro terminal)" -ForegroundColor Yellow
}

Write-Host ""

# Verifica banco de dados
Write-Host "🗄️  Verificando banco de dados..." -ForegroundColor Yellow
if (Test-Path "prisma\dev.db") {
    Write-Host "   ✅ Banco de dados existe" -ForegroundColor Green
    
    # Conta rifas
    $output = npx prisma db execute --stdin --file prisma/list_rifas.ts 2>&1
    Write-Host "   💡 Para ver rifas: npx prisma studio" -ForegroundColor Cyan
} else {
    Write-Host "   ❌ Banco de dados NÃO encontrado" -ForegroundColor Red
    Write-Host "   💡 Execute: npx prisma migrate dev" -ForegroundColor Yellow
}

Write-Host ""

# Verifica credenciais do Mercado Pago
Write-Host "🔑 Verificando credenciais do Mercado Pago..." -ForegroundColor Yellow
$envContent = Get-Content .env -Raw
if ($envContent -match "MERCADOPAGO_ACCESS_TOKEN=`"TEST-") {
    Write-Host "   ✅ Credenciais de TESTE configuradas" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Credenciais podem estar incorretas" -ForegroundColor Yellow
    Write-Host "   💡 Verifique o arquivo .env" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "📋 CHECKLIST DOS 4 TESTES:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   1. ⏳ Configurar webhook no Mercado Pago" -ForegroundColor White
Write-Host "      └─ Acesse: https://www.mercadopago.com.br/developers/panel/webhooks" -ForegroundColor Gray
Write-Host "      └─ Use a URL do Ngrok + /api/webhook/payment" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. ✅ Testar criação de PIX" -ForegroundColor White
Write-Host "      └─ Acesse http://localhost:3001" -ForegroundColor Gray
Write-Host "      └─ Clique em 'Participar Agora' no Gol" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. ✅ Simular pagamento" -ForegroundColor White
Write-Host "      └─ Use o painel do Mercado Pago ou cartão de teste" -ForegroundColor Gray
Write-Host ""
Write-Host "   4. ✅ Verificar números gerados" -ForegroundColor White
Write-Host "      └─ Execute: npx prisma studio" -ForegroundColor Gray
Write-Host "      └─ Veja a tabela 'Ticket'" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 Guia completo em: GUIA_TESTES_MERCADOPAGO.md" -ForegroundColor Yellow
Write-Host ""
