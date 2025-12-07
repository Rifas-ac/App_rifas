# 🏠 NOVA PÁGINA INICIAL - LISTAGEM DE RIFAS

## ✨ O que foi feito:

### 1. **Nova Home Page**
- ✅ Grid responsivo com cards de rifas
- ✅ Design moderno com gradientes e sombras
- ✅ Rifas **ATIVAS** aparecem coloridas com botão "Participar Agora"
- ✅ Rifas **EM BREVE** aparecem em preto e branco com badge amarelo
- ✅ Hover effects e animações suaves

### 2. **Visual dos Cards**
Cada card mostra:
- 📸 Imagem do carro (colorida se ativa, P&B se em breve)
- 🏷️ Badge "EM BREVE" para rifas futuras
- 🎯 Título do carro
- 🏆 Descrição do prêmio
- 💬 Descrição detalhada
- 🎫 Botão "Participar Agora" (ativo) ou "Em Breve" (desabilitado)
- 💳 Informação de pagamento via PIX

---

## 🚀 Como Testar:

### 1. **Popular o Banco com Rifas de Exemplo**

```powershell
# Execute o script de seed
node prisma/seed_rifas.js
```

Isso criará 3 rifas:
- ✅ **Gol LS 1986** - ATIVA (colorida)
- ⏰ **Honda Civic 2015** - EM BREVE (P&B)
- ⏰ **Toyota Corolla 2020** - EM BREVE (P&B)

### 2. **Iniciar o Servidor**

```powershell
npm run dev
```

### 3. **Acessar a Home**

Abra: http://localhost:3000

Você verá:
- Grid com 2 colunas (responsivo)
- Gol LS colorido com botão laranja "Participar Agora"
- Civic e Corolla em preto e branco com badge "EM BREVE"

### 4. **Clicar em "Participar Agora"**

Ao clicar no Gol:
- Redireciona para `/rifas/ativa?id=rifa-gol-1986`
- Mostra a página de detalhes da rifa (página antiga)

---

## 📁 Arquivos Modificados:

- `src/app/page.tsx` - Nova home com listagem de rifas
- `src/app/page_backup.tsx` - Backup da home antiga
- `prisma/seed_rifas.js` - Script para popular rifas de exemplo

---

## 🎨 Personalizações Disponíveis:

### Adicionar Mais Rifas:

```javascript
// Edite prisma/seed_rifas.js e adicione:
const rifaNova = await prisma.rifa.create({
  data: {
    titulo: 'Nome do Carro',
    descricao: 'Descrição completa...',
    premio: 'Prêmio',
    imagemUrl: '/caminho/imagem.jpg', // ou null para ícone padrão
    valorPorNumero: 15.00,
    quantidadeMaximaNumeros: 1500,
    ativa: true, // true = colorido, false = P&B
    dataInicio: new Date(),
    dataFim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
});
```

### Mudar Status de uma Rifa:

```javascript
// Ativar rifa "em breve"
await prisma.rifa.update({
  where: { id: 'rifa-civic-2015' },
  data: { ativa: true }
});
```

---

## 🔄 Fluxo do Usuário:

1. **Página Inicial** (`/`)
   - Vê grid de rifas disponíveis
   - Rifas ativas e "em breve"

2. **Clica em "Participar Agora"**
   - Redireciona para `/rifas/ativa?id=XXX`
   - Mostra detalhes completos da rifa

3. **Preenche dados e gera PIX**
   - Fluxo normal de pagamento

4. **Após pagamento**
   - Popup de sucesso com números animados
   - Pode ver status em `/cliente/status`

---

## 📱 Responsividade:

- **Mobile**: 1 card por linha
- **Tablet**: 2 cards por linha
- **Desktop**: 2 cards por linha (centralizado)

---

## 🎯 Próximos Passos:

1. Adicionar imagens reais dos carros
2. Configurar rifas reais no banco
3. Testar todo o fluxo de compra
4. Adicionar mais informações nos cards (data de sorteio, números restantes, etc.)

---

## 🆘 Problemas Comuns:

### Cards aparecem todos em P&B
- Verifique se a rifa está com `ativa: true` no banco

### Imagem não aparece
- Verifique o caminho em `imagemUrl`
- Coloque a imagem em `/public/`

### Botão não funciona
- Verifique se existe a rota `/rifas/ativa`
- Confirme que o ID da rifa está correto

