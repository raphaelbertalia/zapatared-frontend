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
  const location = useLocation();
  const estaNaTelaDeLogin = location.pathname === '/login';

  useEffect(() => {
    const sync = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* CABEÇALHO COM LOGO E NAVBAR */}
      <header className="flex flex-col items-center p-4">
        <div className="flex justify-center mb-6">
          <img
            src="/logo.png"
            alt="Logo da Subsede"
            className="block w-[14rem] h-auto object-contain"
          />
        </div>

        {token && !estaNaTelaDeLogin && (
          <div className="flex justify-center gap-4 mb-6">
            <Navbar />
          </div>
        )}
      </header>

      {/* CONTEÚDO DAS PÁGINAS (SEM CENTRALIZAR) */}
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
