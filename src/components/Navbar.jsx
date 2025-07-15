import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="flex justify-center mb-6 gap-4">
      <button
        onClick={() => navigate('/membros')}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Membros
      </button>
      <button
        onClick={() => navigate('/mensalidades')}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Mensalidades
      </button>
      <button
        onClick={() => navigate('/cadastro')}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Cadastro
      </button>
    </nav>
  );
}
