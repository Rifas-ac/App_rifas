# Script para iniciar testes do Mercado Pago
# Execute este script para iniciar o servidor Next.js

Write-Host "🚀 Iniciando servidor Next.js na porta 3001..." -ForegroundColor Green
Write-Host ""

# Verifica se já tem um processo na porta 3001
$processo = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if ($processo) {
    Write-Host "⚠️  Porta 3001 já está em uso. Encerrando processo..." -ForegroundColor Yellow
    $pid = $processo.OwningProcess
    Stop-Process -Id $pid -Force
    Start-Sleep -Seconds 2
}

# Inicia o servidor
Write-Host "📦 Executando npm run dev..." -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 IMPORTANTE:" -ForegroundColor Yellow
Write-Host "   1. Deixe este terminal aberto (servidor rodando)" -ForegroundColor White
Write-Host "   2. Abra OUTRO terminal para executar o Ngrok" -ForegroundColor White
Write-Host "   3. Comando do Ngrok: .\ngrok.exe http 3001" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Servidor estará disponível em: http://localhost:3001" -ForegroundColor Green
Write-Host "📖 Guia completo: Abra o arquivo GUIA_TESTES_MERCADOPAGO.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

npm run dev
