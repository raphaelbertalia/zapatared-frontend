
import { useNavigate } from 'react-router-dom';

export default function EscolhaModulo() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Escolha o módulo</h1>
      <button onClick={() => navigate('/tesouraria/membros')}>Tesouraria</button>
      <button onClick={() => navigate('/grife/produtos')}>Grife</button>
    </div>
  );
}
