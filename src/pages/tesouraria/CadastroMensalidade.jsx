import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { fetchComToken } from '../../utils/fetchComToken';
import { API_BASE } from '../../utils/api';

export default function CadastroMensalidade() {
  const { membroId } = useParams();
  const navigate = useNavigate();

  const [mensalidade, setMensalidade] = useState({ mes: '', valor: '' });
  const [erros, setErros] = useState({});
  const [mensalidades, setMensalidades] = useState([]);
  const [membro, setMembro] = useState(null);

  // Carrega mensalidades e dados do membro
  useEffect(() => {
    async function carregarDados() {
      try {
        // Buscar mensalidades
        const resMens = await fetchComToken(`${API_BASE}/mensalidades`);
        if (resMens) {
          const todas = await resMens.json();
          const desteMembro = todas.filter(
            (ms) => String(ms.membroId) === String(membroId)
          );
          setMensalidades(desteMembro);
        }

        // Buscar membro
        const resMembro = await fetchComToken(`${API_BASE}/membros/${membroId}`);
        if (resMembro) {
          const data = await resMembro.json();
          setMembro(data);
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      }
    }

    carregarDados();
  }, [membroId]);

  function validar() {
    const e = {};
    if (!/^((0[1-9])|(1[0-2]))\/\d{4}$/.test(mensalidade.mes)) {
      e.mes = 'Informe o mês no formato MM/YYYY';
    }
    const valor = parseFloat(mensalidade.valor);
    if (isNaN(valor) || valor <= 0) {
      e.valor = 'Informe um valor válido';
    }
    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function handleSalvar() {
    if (!validar()) return;

    try {
      const res = await fetchComToken(`${API_BASE}/mensalidades`, {
        method: 'POST',
        body: JSON.stringify({
          ...mensalidade,
          membroId,
          valor: parseFloat(mensalidade.valor),
        }),
      });

      if (!res) {
        alert('Erro ao salvar mensalidade');
        return;
      }

      if (res.status === 409) {
        const data = await res.json();
        alert(data.erro || 'Parcela já cadastrada para este mês e membro.');
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        alert(data.erro || 'Erro ao salvar mensalidade');
        return;
      }

      alert('Mensalidade cadastrada com sucesso!');
      setMensalidade({ mes: '', valor: '' });

      // Recarrega mensalidades
      const resMens = await fetchComToken(`${API_BASE}/mensalidades`);
      if (resMens) {
        const todas = await resMens.json();
        const desteMembro = todas.filter(
          (ms) => String(ms.membroId) === String(membroId)
        );
        setMensalidades(desteMembro);
      }
    } catch (err) {
      console.error('Erro ao cadastrar mensalidade:', err);
      alert('Erro ao cadastrar mensalidade');
    }
  }

  function estaAtrasada(ms) {
    if (ms.pago) return false;
    return new Date(ms.vencimento) < new Date();
  }

  function enviarWhatsapp() {
    if (!membro) {
      alert('Membro não carregado');
      return;
    }

    const atrasadas = mensalidades.filter(estaAtrasada);
    if (atrasadas.length === 0) {
      alert('Não há mensalidades atrasadas para este membro.');
      return;
    }

    const numero = membro.telefone?.replace(/\D/g, '');
    if (!numero) {
      alert('Telefone do membro não informado.');
      return;
    }

    const lista = atrasadas
      .map((ms) => `${ms.mes} - R$ ${(Number(ms.valor) || 0).toFixed(2)}`)
      .join('\n');

    const msg = `Olá ${membro.apelido},

Identificamos as seguintes mensalidades em atraso:
${lista}

Por favor, entre em contato para regularizar.`;

    window.open(`https://wa.me/55${numero}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="font-['Hellprint'] text-3xl font-bold text-[#ec4303] mb-6">
        Nova Mensalidade
      </h1>

      <label className="block mb-2 font-semibold text-left">Mês (MM/YYYY):</label>
      <input
        type="text"
        value={mensalidade.mes}
        onChange={(e) => setMensalidade((p) => ({ ...p, mes: e.target.value }))}
        className={`w-full border rounded px-3 py-2 mb-2 ${erros.mes ? 'border-red-600' : ''}`}
        placeholder="Ex: 07/2025"
      />
      {erros.mes && <p className="text-red-600 mb-2">{erros.mes}</p>}

      <label className="block mb-2 font-semibold text-left">Valor (R$):</label>
      <input
        type="number"
        step="0.01"
        value={mensalidade.valor}
        onChange={(e) => setMensalidade((p) => ({ ...p, valor: e.target.value }))}
        className={`w-full border rounded px-3 py-2 mb-2 ${erros.valor ? 'border-red-600' : ''}`}
        placeholder="Ex: 150.00"
      />
      {erros.valor && <p className="text-red-600 mb-2">{erros.valor}</p>}

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => navigate('/membros')}
          className="bg-gray-300 rounded px-4 py-2"
        >
          Cancelar
        </button>
        <button
          onClick={handleSalvar}
          className="bg-green-600 text-white rounded px-4 py-2"
        >
          Salvar
        </button>
      </div>

      {/* Lista de mensalidades */}
      {mensalidades.length > 0 && (
        <div className="mt-8">
          <h2 className="font-semibold mb-2 text-left">
            Mensalidades cadastradas
            {membro?.apelido && (
              <> — <span className="text-[#ec4303] font-['Hellprint']">{membro.apelido}</span></>
            )}
          </h2>
          <ul className="list-disc pl-4 text-gray-700 mb-4">
            {mensalidades.map((ms) => (
              <li key={ms.id}>
                {ms.mes} — R$ {(Number(ms.valor) || 0).toFixed(2)} —{' '}
                {ms.pago ? '✅ Pago' : '❌ Pendente'}
              </li>
            ))}
          </ul>

        </div>
      )}
    </div>
  );
}
