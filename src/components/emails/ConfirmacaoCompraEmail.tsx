interface ConfirmacaoCompraEmailProps {
  nomeUsuario: string;
  numerosComprados: string[];
  tituloRifa: string;
}

export const ConfirmacaoCompraEmail: React.FC<Readonly<ConfirmacaoCompraEmailProps>> = ({
  nomeUsuario,
  numerosComprados,
  tituloRifa
}) => (
  <div>
    <h1>Olá, {nomeUsuario}! 👋</h1>
    <p>
      Seu pagamento foi confirmado com sucesso! Muito obrigado por participar da nossa rifa
      <strong>&quot;{tituloRifa}&quot;</strong>.
    </p>
    <p>Estes são os seus números da sorte:</p>
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '16px',
        border: '1px solid #ccc',
        borderRadius: '8px'
      }}>
      {numerosComprados.map(numero => (
        <span
          key={numero}
          style={{ padding: '8px 12px', backgroundColor: '#f0f0f0', borderRadius: '4px', fontWeight: 'bold' }}>
          {numero}
        </span>
      ))}
    </div>
    <br />
    <p>O sorteio será realizado na data informada. Fique de olho e boa sorte!</p>
    <p>
      Atenciosamente,
      <br />
      Equipe da Rifa
    </p>
  </div>
);
