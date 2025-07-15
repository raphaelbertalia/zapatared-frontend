import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

import { fetchComToken } from '../utils/fetchComToken';
import { API_BASE } from '../utils/api';

export default function Membros() {
    // ──────────────────── STATE ────────────────────
    const [membros, setMembros] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [formData, setFormData] = useState({
        nome: '',
        apelido: '',
        telefone: '',
        email: '',
        status: '',
        graduacao: 'Camiseta',
        funcao: '',
    });

    // rótulos para o <select>
    const graduacoes = [
        'CAMISETA',
        'PROSPERO',
        'MEIO_ESCUDO',
        'OFICIAL',
        'HONRADO',
        'VETERANO',
    ];

    // Enum → Label
    const enumParaLabel = {
        CAMISETA: 'Camiseta',
        PROSPERO: 'Próspero',
        MEIO_ESCUDO: 'Meio Escudo',
        OFICIAL: 'Oficial',
        HONRADO: 'Honrado',
        VETERANO: 'Veterano',
    };

    // removido modal mensalidade
    const [erros, setErros] = useState({});
    const [mensalidadesVisiveis, setMensalidadesVisiveis] = useState({});

    const navigate = useNavigate();
    const [busca, setBusca] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('');
    const [filtroGraduacao, setFiltroGraduacao] = useState('');

    // ──────────────────── EFFECTS ────────────────────
    useEffect(() => {
        buscarMembros();
    }, []);

    const membrosFiltrados = useMemo(() =>
        membros.filter((m) => {
            const texto = `${m.nome} ${m.apelido}`.toLowerCase();

            if (busca && !texto.includes(busca.toLowerCase())) return false;
            if (filtroStatus && m.status !== filtroStatus) return false;
            if (filtroGraduacao && m.graduacao !== filtroGraduacao) return false;

            return true;
        }),
        [membros, busca, filtroStatus, filtroGraduacao]
    );

    const totais = useMemo(() => {
        // Inicializa o objeto com contadores
        const statusContagem = { ativo: 0, inativo: 0, isento: 0, afastado: 0 };
        const graduacaoContagem = { CAMISETA: 0, PROSPERO: 0, MEIO_ESCUDO: 0, OFICIAL: 0, HONRADO: 0, VETERANO: 0 };

        membrosFiltrados.forEach(membro => {
            // Conta status
            if (statusContagem[membro.status] !== undefined) {
                statusContagem[membro.status]++;
            }
            // Conta graduação
            if (graduacaoContagem[membro.graduacao] !== undefined) {
                graduacaoContagem[membro.graduacao]++;
            }
        });

        return { statusContagem, graduacaoContagem, total: membrosFiltrados.length };
    }, [membrosFiltrados]);

    async function buscarMembros() {
        try {
            const res = await fetchComToken(`${API_BASE}/membros`);
            if (!res) return;
            const data = await res.json();
            setMembros(data);
        } catch (err) {
            console.error('Erro ao buscar membros:', err);
        }
    }

    // ──────────────────── CRUD MEMBROS ────────────────────
    async function salvarEdicao(id) {
        try {
            const res = await fetchComToken(`${API_BASE}/membros/${id}`, {
                method: 'PUT',
                body: JSON.stringify(formData),
            });
            if (!res) return;
            setEditandoId(null);
            buscarMembros();
        } catch (err) {
            console.error('Erro ao atualizar membro:', err);
        }
    }

    async function deletarMembro(id) {
        if (!window.confirm('Tem certeza que deseja excluir este membro?')) return;
        try {
            const res = await fetchComToken(`${API_BASE}/membros/${id}`, {
                method: 'DELETE',
            });
            if (!res) return;
            buscarMembros();
        } catch (err) {
            console.error('Erro ao excluir membro:', err);
        }
    }

    // ──────────────────── CRUD MENSALIDADE ────────────────────
    async function alternarStatusPago(mensalidadeId, novoStatus) {
        try {
            const res = await fetchComToken(`${API_BASE}/mensalidades/${mensalidadeId}/pago`, {
                method: 'PATCH',
                body: JSON.stringify({ pago: novoStatus }),
            });
            if (!res) return;
            buscarMembros();
        } catch (err) {
            console.error('Erro ao atualizar status de pagamento:', err);
        }
    }

    function estaAtrasada(ms) {
        if (ms.pago) return false;
        return new Date(ms.vencimento) < new Date();
    }

    async function deletarMensalidade(id) {
        if (!window.confirm('Tem certeza que deseja excluir esta mensalidade?')) return;
        try {
            const res = await fetchComToken(`${API_BASE}/mensalidades/${id}`, {
                method: 'DELETE',
            });
            if (!res) return;
            buscarMembros();
        } catch (err) {
            console.error('Erro ao excluir mensalidade:', err);
        }
    }

    const toggleMensalidades = (id) => setMensalidadesVisiveis((p) => ({ ...p, [id]: !p[id] }));

    // ──────────────────── RENDER ────────────────────
    return (
        <div className="p-6">
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="font-['Hellprint'] text-3xl font-bold text-[#ec4303]">Zapata Red</h1>
                <h2 className="font-['Hellprint'] text-2xl text-[#ec4303]">Membros</h2>
            </div>

            {/* FILTROS */}
            <div className="mb-4 flex flex-wrap gap-4 items-end justify-center">
                {/* Busca */}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">Buscar</label>
                    <input
                        type="text"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Nome ou Apelido"
                        className="border rounded px-3 py-2"
                    />
                </div>

                {/* Status */}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">Status</label>
                    <select
                        value={filtroStatus}
                        onChange={(e) => setFiltroStatus(e.target.value)}
                        className="border rounded px-3 py-2"
                    >
                        <option value="">Todos</option>
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                        <option value="isento">Isento</option>
                        <option value="afastado">Afastado</option>
                    </select>
                </div>

                {/* Graduação */}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">Graduação</label>
                    <select
                        value={filtroGraduacao}
                        onChange={(e) => setFiltroGraduacao(e.target.value)}
                        className="border rounded px-3 py-2"
                    >
                        <option value="">Todas</option>
                        {Object.keys(enumParaLabel).map((g) => (
                            <option key={g} value={g}>
                                {enumParaLabel[g]}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={() => { setBusca(''); setFiltroStatus(''); setFiltroGraduacao(''); }}
                    className="text-sm text-blue-600 underline mb-4"
                >
                    Limpar filtros
                </button>
            </div>

            <div className="mb-6 flex justify-end">
                <button
                    onClick={() => navigate('/cadastro')}
                    className="font-['Hellprint'] bg-[#fff200] text-white rounded-padrao shadow-leve px-4 py-2"
                >
                    + Cadastrar Membro
                </button>
            </div>

            {/* Lista */}
            {membrosFiltrados.length === 0 ? (
                <p>Nenhum membro encontrado.</p>
            ) : (
                <ul className="space-y-4">
                    {membrosFiltrados.map((membro) => (
                        <li key={membro.id} className="p-4 border rounded shadow-sm bg-white">
                            {editandoId === membro.id ? (
                                <div className="space-y-2">
                                    {['apelido', 'nome', 'telefone', 'email', 'funcao'].map((campo) => (
                                        <input
                                            key={campo}
                                            type="text"
                                            name={campo}
                                            value={formData[campo]}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, [campo]: e.target.value }))
                                            }
                                            placeholder={campo}
                                            className="w-full border rounded px-3 py-1"
                                        />
                                    ))}

                                    <select
                                        name="graduacao"
                                        value={formData.graduacao}
                                        onChange={(e) => setFormData((p) => ({ ...p, graduacao: e.target.value }))}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        {graduacoes.map((g) => (
                                            <option key={g} value={g}>
                                                {enumParaLabel[g]}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={(e) =>
                                            setFormData((p) => ({ ...p, status: e.target.value }))
                                        }
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="ativo">Ativo</option>
                                        <option value="inativo">Inativo</option>
                                        <option value="isento">Isento</option>
                                        <option value="afastado">Afastado</option>
                                    </select>

                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => salvarEdicao(membro.id)}
                                            className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Salvar
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditandoId(null);
                                                setFormData({
                                                    apelido: membro.apelido,
                                                    nome: membro.nome,
                                                    telefone: membro.telefone,
                                                    email: membro.email || '',
                                                    status: membro.status,
                                                    graduacao: membro.graduacao || 'CAMISETA',
                                                    funcao: membro.funcao || '',
                                                });
                                            }}
                                            className="bg-gray-300 px-3 py-1 rounded text-sm"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-start text-left">
                                    <div>
                                        <strong className="text-xl">{membro.apelido}</strong>
                                        <br />
                                        Status: <strong>{membro.status}</strong>
                                        <br />
                                        Nome: <strong>{membro.nome}</strong>
                                        <br />
                                        CPF: <strong>{membro.cpf || 'Não informado'}</strong>
                                        <br />
                                        Telefone: {membro.telefone}
                                        <br />
                                        Email: {membro.email || 'Não informado'}
                                        <br />
                                        Graduação: {enumParaLabel[membro.graduacao] || membro.graduacao}
                                        <br />
                                        Função: {membro.funcao || 'Não definida'}

                                        {mensalidadesVisiveis[membro.id] && (
                                            membro.mensalidades?.length > 0 ? (
                                                <div className="mt-2 text-gray-700">
                                                    <ul className="list-disc pl-4">
                                                        {membro.mensalidades.map((ms) => (
                                                            <li key={ms.id} className="flex items-center gap-2">
                                                                <span>
                                                                    {ms.mes} — R$ {(parseFloat(ms.valor) || 0).toFixed(2)} — {ms.pago ? '✅ Pago' : '❌ Pendente'}
                                                                </span>
                                                                <button
                                                                    onClick={() => alternarStatusPago(ms.id, !ms.pago)}
                                                                    className={`text-xs px-2 py-1 rounded ${ms.pago ? 'bg-yellow-500' : 'bg-green-600 text-white'}`}
                                                                >
                                                                    {ms.pago ? 'Desmarcar' : 'Marcar como Pago'}
                                                                </button>
                                                                <button
                                                                    onClick={() => deletarMensalidade(ms.id)}
                                                                    className="text-xs px-2 py-1 rounded bg-red-600 text-white"
                                                                >
                                                                    Excluir
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>

                                                    {/* BOTÃO WHATSAPP – aparece só se houver atrasadas */}
                                                    {membro.mensalidades.some((ms) => !ms.pago && new Date(ms.vencimento) < new Date()) && (
                                                        <div className="mt-3">
                                                            <button
                                                                className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                                                                onClick={() => {
                                                                    const atrasadas = membro.mensalidades.filter(ms => !ms.pago && new Date(ms.vencimento) < new Date());
                                                                    const numero = membro.telefone.replace(/\D/g, '');

                                                                    const lista = atrasadas
                                                                        .map(ms => `${ms.mes} - R$ ${(Number(ms.valor) || 0).toFixed(2)}`)
                                                                        .join('\n');

                                                                    const msg = `{Mensagem Automatica}
VIVA!, ${membro.apelido},

Identificamos as seguintes mensalidades em atraso:
${lista}

Por favor, entre em contato para regularizar.`;

                                                                    const url = `https://wa.me/55${numero}?text=${encodeURIComponent(msg)}`;

                                                                    console.log('Abrindo link:', url);
                                                                    window.open(url, '_blank');
                                                                }}
                                                            >
                                                                Cobrar WhatsApp
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="mt-2 text-gray-600 italic">Membro sem mensalidade.</p>
                                            )
                                        )}
                                    </div>

                                    {/* AÇÕES */}
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => {
                                                setEditandoId(membro.id);
                                                setFormData({
                                                    apelido: membro.apelido,
                                                    nome: membro.nome,
                                                    telefone: membro.telefone,
                                                    email: membro.email || '',
                                                    status: membro.status,
                                                    graduacao: membro.graduacao || 'CAMISETA',
                                                    funcao: membro.funcao || '',
                                                });
                                            }}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => deletarMembro(membro.id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Excluir
                                        </button>
                                        <button
                                            onClick={() => navigate(`/mensalidade/${membro.id}`)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                        >
                                            + Mensalidade
                                        </button>
                                        <button
                                            onClick={() => toggleMensalidades(membro.id)}
                                            className="text-sm text-blue-600 underline"
                                        >
                                            {mensalidadesVisiveis[membro.id] ? 'Ocultar mensalidades' : 'Ver mensalidades'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {/* Estatísticas */}
            <div className="mt-6 p-4 bg-gray-100 rounded shadow text-left text-gray-700"><div>
                <strong>Total de membros:</strong> {totais.total}
            </div>
                <br />
                <div>
                    <strong>Status:</strong> &nbsp;
                    Ativo: {totais.statusContagem.ativo} |
                    Inativo: {totais.statusContagem.inativo} |
                    Isento: {totais.statusContagem.isento} |
                    Afastado: {totais.statusContagem.afastado}
                </div>
                <br />
                <div>
                    <strong>Graduação:</strong> &nbsp;
                    Camiseta: {totais.graduacaoContagem.CAMISETA} |
                    Próspero: {totais.graduacaoContagem.PROSPERO} |
                    Meio Escudo: {totais.graduacaoContagem.MEIO_ESCUDO} |
                    Oficial: {totais.graduacaoContagem.OFICIAL} |
                    Honrado: {totais.graduacaoContagem.HONRADO} |
                    Veterano: {totais.graduacaoContagem.VETERANO}
                </div>
            </div></div>
    );
}
