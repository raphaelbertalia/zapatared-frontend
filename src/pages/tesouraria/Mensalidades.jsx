import { useEffect, useState } from 'react';
import { fetchComToken } from '../../utils/fetchComToken';
import { API_BASE } from '../../utils/api';

export default function Mensalidades() {
  const [mensalidades, setMensalidades] = useState([]);
  const [filtroMembro, setFiltroMembro] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');

  useEffect(() => {
    buscarMensalidades();
  }, []);

  async function buscarMensalidades() {
    try {
      const res = await fetchComToken(`${API_BASE}/mensalidades`);
      if (!res) return;
      const data = await res.json();
      setMensalidades(data);
    } catch (err) {
      console.error('Erro ao buscar mensalidades:', err);
    }
  }

  async function alternarStatus(id, novoStatus) {
    try {
      const res = await fetchComToken(`${API_BASE}/mensalidades/${id}/pago`, {
        method: 'PATCH',
        body: JSON.stringify({ pago: novoStatus }),
      });
      if (!res) return;
      buscarMensalidades();
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  }

  async function deletarMensalidade(id) {
    const confirmar = window.confirm('Tem certeza que deseja excluir esta mensalidade?');
    if (!confirmar) return;

    try {
      const res = await fetchComToken(`${API_BASE}/mensalidades/${id}`, {
        method: 'DELETE',
      });
      if (!res) return;
      buscarMensalidades();
    } catch (err) {
      console.error('Erro ao excluir mensalidade:', err);
    }
  }

  const mensalidadesFiltradas = mensalidades.filter(m => {
    const nomeOuApelido = (m.membro?.apelido || m.membro?.nome || '').toLowerCase();
    const filtroNome = filtroMembro.toLowerCase();
    const passaNome = nomeOuApelido.includes(filtroNome);

    const passaStatus =
      filtroStatus === ''
      || (filtroStatus === 'pago' && m.pago)
      || (filtroStatus === 'pendente' && !m.pago);

    return passaNome && passaStatus;
  });

  // Calculando totalizadores
  const totalGeral = mensalidadesFiltradas.length;
  const totalPagas = mensalidadesFiltradas.filter(m => m.pago).length;
  const totalPendentes = mensalidadesFiltradas.filter(m => !m.pago).length;
  const totalAtrasadas = mensalidadesFiltradas.filter(m => {
    return !m.pago && new Date(m.vencimento) < new Date();
  }).length;

  const agrupadoPorMembro = mensalidadesFiltradas.reduce((acc, m) => {
    const apelido = m.membro?.apelido || m.membro?.nome || 'Membro desconhecido';
    if (!acc[apelido]) acc[apelido] = [];
    acc[apelido].push(m);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Mensalidades</h2>

      <h3 className="text-xl font-semibold mb-4 text-center">Filtros</h3>
      <div className="flex flex-wrap gap-6 mb-6 justify-center">
        <input
          type="text"
          placeholder="Filtrar por nome ou apelido"
          value={filtroMembro}
          onChange={e => setFiltroMembro(e.target.value)}
          className="border px-3 py-2 rounded w-60"
        />
        <select
          value={filtroStatus}
          onChange={e => setFiltroStatus(e.target.value)}
          className="border px-3 py-2 rounded w-40"
        >
          <option value="">Todos</option>
          <option value="pago">Pagos</option>
          <option value="pendente">Pendentes</option>
        </select>
      </div>

      {Object.entries(agrupadoPorMembro).map(([apelido, mensalidadesDoMembro]) => {
        const membro = mensalidadesDoMembro[0]?.membro;
        const pendentes = mensalidadesDoMembro.filter(ms => !ms.pago && new Date(ms.vencimento) < new Date());

        function enviarWhatsapp() {
          if (!membro || !membro.telefone) {
            alert('Telefone do membro não informado.');
            return;
          }

          if (pendentes.length === 0) {
            alert(`Nenhuma mensalidade pendente para ${apelido}`);
            return;
          }

          const numero = membro.telefone.replace(/\D/g, '');

          const lista = pendentes
            .map(ms => `${ms.mes} - R$ ${(parseFloat(ms.valor) || 0).toFixed(2)}`)
            .join('\n');

          const msg = `Olá ${membro.apelido || membro.nome},

Identificamos as seguintes mensalidades em atraso:
${lista}

Por favor, entre em contato para regularizar.`;

          window.open(`https://wa.me/55${numero}?text=${encodeURIComponent(msg)}`, '_blank');
        }

        return (
          <div key={apelido} className="bg-white p-4 rounded shadow mb-6 text-left">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{apelido}</h3>
              {pendentes.length > 0 && (
                <button
                  onClick={enviarWhatsapp}
                  className="bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700"
                >
                  Cobrar pelo WhatsApp - {pendentes.length} atrasada(s)
                </button>
              )}
            </div>
            <ul className="space-y-3">
              {mensalidadesDoMembro.map(m => (
                <li key={m.id} className="border-b pb-2 flex justify-between items-center">
                  <div>
                    <div><strong>{m.mes}</strong> — R$ {(parseFloat(m.valor) || 0).toFixed(2)}</div>
                    <div>{m.pago ? '✅ Pago' : '❌ Pendente'}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => alternarStatus(m.id, !m.pago)}
                      className={`text-xs px-2 py-1 rounded ${m.pago ? 'bg-yellow-500' : 'bg-green-600'} text-white`}
                    >
                      {m.pago ? 'Desmarcar como pago' : 'Marcar como pago'}
                    </button>
                    <button
                      onClick={() => deletarMensalidade(m.id)}
                      className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Mensalidades</h2>

        {/* Totalizadores com cores */}
        <div className="mb-6 flex justify-center gap-8 font-semibold text-center text-gray-700">
          <div
            className="rounded-lg shadow-sm px-6 py-3 min-w-[100px] border"
            style={{ backgroundColor: '#fde68a', borderColor: '#fcd34d', color: '#b45309' }} // amarelo claro
          >
            Total<br />
            <span className="text-2xl">{totalGeral}</span>
          </div>
          <div
            className="rounded-lg shadow-sm px-6 py-3 min-w-[100px] border"
            style={{ backgroundColor: '#bbf7d0', borderColor: '#4ade80', color: '#166534' }} // verde claro
          >
            Pagas<br />
            <span className="text-2xl">{totalPagas}</span>
          </div>
          <div
            className="rounded-lg shadow-sm px-6 py-3 min-w-[100px] border"
            style={{ backgroundColor: '#fef9c3', borderColor: '#fde047', color: '#92400e' }} // amarelo médio
          >
            Pendentes<br />
            <span className="text-2xl">{totalPendentes}</span>
          </div>
          <div
            className="rounded-lg shadow-sm px-6 py-3 min-w-[100px] border"
            style={{ backgroundColor: '#fecaca', borderColor: '#f87171', color: '#7f1d1d' }} // vermelho claro
          >
            Atrasadas<br />
            <span className="text-2xl">{totalAtrasadas}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
