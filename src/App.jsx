import { useState } from 'react';
import Membros from './pages/Membros';
import CadastroMembro from './pages/CadastroMembro';

function App() {
  const [tela, setTela] = useState('lista');

  return (
  <div className="min-h-screen bg-gray-100 p-4">
    <div className="flex justify-center mb-4">
      <img
        src="/logo.png"
        alt="Logo da Subsede"
        className="h-40 w-auto object-contain"
      />
    </div>

    <nav className="max-w-3xl mx-auto mb-6 flex justify-center gap-4">
      <button
        onClick={() => setTela('lista')}
        className={`px-4 py-2 rounded ${tela === 'lista' ? 'bg-blue-600 text-white' : 'bg-white'}`}
      >
        Lista de Membros
      </button>
      <button
        onClick={() => setTela('cadastro')}
        className={`px-4 py-2 rounded ${tela === 'cadastro' ? 'bg-blue-600 text-white' : 'bg-white'}`}
      >
        Cadastrar Membro
      </button>
    </nav>

    {tela === 'lista' && <Membros />}
    {tela === 'cadastro' && <CadastroMembro />}
  </div>
);
}

export default App;