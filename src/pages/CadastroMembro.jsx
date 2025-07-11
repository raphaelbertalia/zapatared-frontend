import { useState } from 'react';

export default function CadastroMembro() {
  const [nome, setNome] = useState('');
  const [apelido, setApelido] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    const novoMembro = { nome, telefone, email, apelido };

    try {
      const res = await fetch('http://localhost:3000/membros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoMembro),
      });

      if (!res.ok) throw new Error('Erro ao cadastrar membro');

      setMensagem('Membro cadastrado com sucesso!');
      setNome('');
      setTelefone('');
      setEmail('');
      setApelido('');
    } catch (error) {
      setMensagem('Erro ao cadastrar membro, tente novamente.');
      console.error(error);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4">Cadastrar Novo Membro</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Apelido</label>
          <input
            type="text"
            value={apelido}
            onChange={e => setApelido(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Telefone</label>
          <input
            type="tel"
            value={telefone}
            onChange={e => setTelefone(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Cadastrar
        </button>
      </form>
      {mensagem && <p className="mt-4 text-center">{mensagem}</p>}
    </div>
  );
}