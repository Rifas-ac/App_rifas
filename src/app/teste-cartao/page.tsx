import { FormularioCartao } from '@/components/FormularioCartao';

export default function PaginaTesteCartao() {
  // Em um app real, esses dados viriam da seleção de números e de um formulário de usuário
  const dadosCompraExemplo = {
    rifaId: 1,
    quantidade: 2,
    comprador: {
      nome: 'Calebe',
      sobrenome: 'Teste',
      cpf: '19119119100', // CPF de teste
      email: 'test_user_123@testuser.com' // E-mail de comprador de teste do MP
    }
  };

  // O valor total da compra (ex: 2 tickets de R$ 15.00)
  const valorTotalExemplo = 50.0;

  return (
    <main style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <h1>Teste de Pagamento com Cartão</h1>
      <p>Preencha os dados do cartão de teste abaixo.</p>

      <div style={{ border: '1px solid #eee', padding: '1rem', marginTop: '1rem' }}>
        <FormularioCartao valorTotal={valorTotalExemplo} dadosCompra={dadosCompraExemplo} />
      </div>
    </main>
  );
}
