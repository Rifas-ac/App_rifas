# 🎉 PÁGINA INICIAL ATUALIZADA

## ✅ Mudanças Implementadas:

### 1. **Banner de Boas-Vindas**
```
🌟 Bem-vindo!
🎉 Participe de um Sorteio
Sua chance de ganhar carros incríveis com números da sorte!
💳 Pagamento fácil via PIX • 🎫 Números instantâneos • 🏆 Prêmios garantidos

📋 Escolha o seu Sorteio
```

### 2. **Card do Gol LS 1986** (Ativo)
- Badge verde piscando: "🎯 SORTEIO EM ANDAMENTO"
- Imagem colorida
- Botão laranja: "🎫 Participar Agora"
- Ao clicar: vai para a página de detalhes da rifa

### 3. **Card do Chevette DL 92** (Em Breve)
- Badge amarelo: "⏰ SORTEIO EM BREVE"
- Imagem em preto e branco (50% opacidade)
- Botão cinza desabilitado: "⏰ Participação do Sorteio Começará em Breve"
- Usa a imagem: `/rifa-Chevete/Chevete-01.jpg`

---

## 🚀 Como Testar:

```powershell
# 1. Popular banco de dados
node prisma/seed_rifas.js

# 2. Iniciar servidor
npm run dev

# 3. Acessar
# http://localhost:3000
```

---

## 📸 Resultado Visual:

### Banner Superior:
- Título grande com gradiente colorido: "Bem-vindo!"
- Subtítulo: "Participe de um Sorteio"
- Benefícios com emojis
- Divisor decorativo com estrela
- "Escolha o seu Sorteio"

### Grid de Rifas:

**GOL LS 1986** (esquerda)
- ✅ Colorido
- ✅ Badge verde "SORTEIO EM ANDAMENTO" (piscando)
- ✅ Botão laranja "Participar Agora"

**CHEVETTE DL 92** (direita)
- ⏰ Preto e branco
- ⏰ Badge amarelo "SORTEIO EM BREVE"
- ⏰ Botão cinza "Participação do Sorteio Começará em Breve"

---

## 📁 Arquivos Modificados:

1. `src/app/page.tsx` - Nova página inicial
2. `prisma/seed_rifas.js` - Adicionado Chevette DL 92

---

## 🎨 Detalhes Técnicos:

### Cores do Banner:
- Gradiente do título: laranja → rosa → roxo
- Texto principal: branco
- Destaque: laranja (#ff6b35)

### Estados das Rifas:
- **Ativa** (`ativa: true`):
  - Imagem colorida
  - Badge verde com animação pulse
  - Botão gradiente laranja/rosa com hover

- **Em Breve** (`ativa: false`):
  - Imagem grayscale + opacity 50%
  - Badge amarelo estático
  - Botão cinza desabilitado
  - Opacidade geral 70%

---

## ✨ Animações:

1. **Badge "SORTEIO EM ANDAMENTO"**: `animate-pulse` (pisca suavemente)
2. **Hover nos cards ativos**: `scale-105` (aumenta 5%)
3. **Hover no botão**: `scale-105` + shadow laranja

