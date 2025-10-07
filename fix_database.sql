-- Script SQL para adicionar os campos necessários no banco
-- Execute este script no seu Supabase SQL Editor

-- Adicionar campo paymentId na tabela Ticket
ALTER TABLE "Ticket" ADD COLUMN IF NOT EXISTS "paymentId" TEXT;

-- Adicionar campo asaasCustomerId na tabela Usuario
ALTER TABLE "Usuario" ADD COLUMN IF NOT EXISTS "asaasCustomerId" TEXT UNIQUE;

-- Verificar se existe ao menos uma rifa ativa
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "Rifa" WHERE status = 'ativa') THEN
        -- Criar uma rifa de exemplo se não existir nenhuma
        INSERT INTO "Rifa" (
            "titulo", 
            "descricao", 
            "premio", 
            "valorCota", 
            "totalNumeros", 
            "status", 
            "createdAt"
        ) VALUES (
            'Rifa de Teste', 
            'Rifa para testar a integração', 
            'Prêmio de R$ 1000', 
            5.00, 
            100, 
            'ativa', 
            NOW()
        );
    END IF;
END $$;