import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useState, useEffect } from 'react';

import Membros from './pages/Membros';
import Mensalidades from './pages/Mensalidades';
import CadastroMembro from './pages/CadastroMembro';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import CadastroMensalidade from './pages/CadastroMensalidade';

function RotaPrivada({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function AppContent() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userName, setUserName] = useState(localStorage.getItem('nome'));
  const location = useLocation();
  const estaNaTelaDeLogin = location.pathname === '/login';

  useEffect(() => {
    const sync = () => {
      setToken(localStorage.getItem('token'));
      setUserName(localStorage.getItem('nome'));
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nome'); // remover a mesma chave que salvou
    setToken(null);
    setUserName(null);
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* TOPO FIXO COM USUÁRIO */}
      {token && !estaNaTelaDeLogin && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            backgroundColor: '#ec4303', // laranja vivo
            color: 'white',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '1rem',
            padding: '0 1.5rem',
            height: '3rem',
            boxSizing: 'border-box',
            zIndex: 9999,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          <span style={{ whiteSpace: 'nowrap' }}>
            Olá, <strong>{userName}</strong>
          </span>
          <button
            onClick={handleLogout}
            type="button"
            style={{
              backgroundColor: '#fff200', // amarelo
              color: '#222',
              fontWeight: '700',
              padding: '0.3rem 1rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              border: 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fff900')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff200')}
          >
            Sair
          </button>
        </div>
      )}

      {/* ESPAÇO PARA O TOPO FIXO */}
      <div style={{ height: token && !estaNaTelaDeLogin ? 48 : 0 }} />

      {/* CABEÇALHO COM LOGO */}
      <header className="flex flex-col items-center p-4">
        <div className="flex justify-center mb-4">
          <img
            src="/logo.png"
            alt="Logo da Subsede"
            className="block w-[14rem] h-auto object-contain"
          />
        </div>

        {/* NAVBAR */}
        {token && !estaNaTelaDeLogin && (
          <div className="flex justify-center gap-4">
            <Navbar />
          </div>
        )}
      </header>

      {/* CONTEÚDO DAS PÁGINAS */}
      <main className="px-4 pb-10">
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route
            path="/mensalidades"
            element={
              <RotaPrivada>
                <Mensalidades />
              </RotaPrivada>
            }
          />
          <Route
            path="/membros"
            element={
              <RotaPrivada>
                <Membros />
              </RotaPrivada>
            }
          />
          <Route
            path="/cadastro"
            element={
              <RotaPrivada>
                <CadastroMembro />
              </RotaPrivada>
            }
          />
          <Route
            path="/mensalidade/:membroId"
            element={
              <RotaPrivada>
                <CadastroMensalidade />
              </RotaPrivada>
            }
          />
          <Route
            path="*"
            element={<Navigate to={token ? '/membros' : '/login'} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
