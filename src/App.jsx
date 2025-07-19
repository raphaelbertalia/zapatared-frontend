import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import Login from './pages/Login';
import EscolhaModulo from './pages/modulo/EscolhaModulo';

import LayoutTesouraria from './pages/tesouraria/LayoutTesouraria';
import LayoutGrife from './pages/grife/LayoutGrife';

import Membros from './pages/tesouraria/Membros'; // ajuste para seu caminho real
import Mensalidades from './pages/tesouraria/Mensalidades'; // ajuste para seu caminho real
import Produtos from './pages/grife/Produtos'; // você pode criar esse como o primeiro
import NovoProduto from './pages/grife/NovoProduto';
import RegistroCompras from './pages/grife/RegistroCompras';

function App() {
  console.log("Frontend atualizado em 19/07/2025");
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route path="/modulo" element={<EscolhaModulo />} />

        {/* Módulo Tesouraria */}
        <Route path="/tesouraria" element={<LayoutTesouraria />}>
          <Route path="membros" element={<Membros />} />
          <Route path="mensalidades" element={<Mensalidades />} />
        </Route>

        {/* Módulo Grife */}
        <Route path="/grife" element={<LayoutGrife />}>
          <Route path="produtos" element={<Produtos />} />
          <Route path="novo-produto" element={<NovoProduto />} />
          <Route path="compras" element={<RegistroCompras />} />
          {/* Você pode adicionar encomendas depois */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
