import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../utils/api';

export default function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || 'Erro ao fazer login');

      localStorage.setItem('token', data.token);
      localStorage.setItem('nome', data.nome);
      setToken(data.token);
      navigate('/modulo');
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="font-['Hellprint'] text-xl font-bold mb-4 text-center">Login</h2>

      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={e => {
          setEmail(e.target.value);
          if (erro) setErro('');
        }}
        className="w-full border px-3 py-2 rounded mb-3"
      />

      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={e => {
          setSenha(e.target.value);
          if (erro) setErro('');
        }}
        className="w-full border px-3 py-2 rounded mb-3"
      />

      {erro && <p className="text-red-600 text-sm mb-3 text-center">{erro}</p>}

      <button
        type="submit"
        disabled={!email || !senha}
        className="bg-amarelo text-white rounded-padrao shadow-leve px-4 py-2 hover:bg-[#d93b00]"
      >
        Entrar
      </button>
    </form>
  );
}
