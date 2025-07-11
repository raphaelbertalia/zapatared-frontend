import { useEffect, useState } from 'react';

export default function Membros() {
    const [membros, setMembros] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [formData, setFormData] = useState({ nome: '', apelido: '', telefone: '', email: '' });
    const [novaMensalidade, setNovaMensalidade] = useState({ mes: '', valor: '' });
    const [modalAberto, setModalAberto] = useState(false);
    const [membroSelecionado, setMembroSelecionado] = useState(null);
    const [erros, setErros] = useState({});

    useEffect(() => {
        buscarMembros();
    }, []);

    function abrirModalMensalidade(membro) {
        setMembroSelecionado(membro);
        setNovaMensalidade({ mes: '', valor: '' });
        setErros({});
        setModalAberto(true);
    }

    async function buscarMembros() {
        try {
            const res = await fetch('http://localhost:3000/membros');
            const data = await res.json();
            setMembros(data);
        } catch (err) {
            console.error('Erro ao buscar membros:', err);
        }
    }

    async function alternarStatusPago(mensalidadeId, novoStatus) {
        try {
            await fetch(`http://localhost:3000/mensalidades/${mensalidadeId}/pago`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pago: novoStatus }),
            });
            buscarMembros();
        } catch (err) {
            console.error('Erro ao atualizar status de pagamento:', err);
        }
    }

    async function deletarMembro(id) {
        const confirmar = window.confirm('Tem certeza que deseja excluir este membro?');
        if (!confirmar) return;

        try {
            await fetch(`http://localhost:3000/membros/${id}`, { method: 'DELETE' });
            buscarMembros();
        } catch (err) {
            console.error('Erro ao excluir membro:', err);
        }
    }

    function iniciarEdicao(membro) {
        setEditandoId(membro.id);
        setFormData({
            apelido: membro.apelido,
            nome: membro.nome,
            telefone: membro.telefone,
            email: membro.email || '',
        });
    }

    function cancelarEdicao() {
        setEditandoId(null);
        setFormData({ apelido: '', nome: '', telefone: '', email: '' });
    }

    async function salvarEdicao(id) {
        try {
            await fetch(`http://localhost:3000/membros/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            setEditandoId(null);
            buscarMembros();
        } catch (err) {
            console.error('Erro ao atualizar membro:', err);
        }
    }

    function validarMensalidade() {
        const novoErros = {};

        // Valida mês formato MM/YYYY
        if (!/^((0[1-9])|(1[0-2]))\/\d{4}$/.test(novaMensalidade.mes)) {
            novoErros.mes = 'Informe o mês no formato MM/YYYY';
        }

        // Valor deve ser número positivo
        const valorNum = parseFloat(novaMensalidade.valor);
        if (isNaN(valorNum) || valorNum <= 0) {
            novoErros.valor = 'Informe um valor positivo válido';
        }

        setErros(novoErros);
        return Object.keys(novoErros).length === 0;
    }

    async function cadastrarMensalidade(membroId) {
        if (!validarMensalidade()) return;

        try {
            await fetch('http://localhost:3000/mensalidades', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...novaMensalidade,
                    membroId,
                    valor: parseFloat(novaMensalidade.valor),
                }),
            });

            setNovaMensalidade({ mes: '', valor: '' });
            setModalAberto(false);
            buscarMembros();
        } catch (err) {
            console.error('Erro ao cadastrar mensalidade:', err);
        }
    }

    async function deletarMensalidade(mensalidadeId) {
        const confirmar = window.confirm('Tem certeza que deseja excluir esta mensalidade?');
        if (!confirmar) return;

        try {
            await fetch(`http://localhost:3000/mensalidades/${mensalidadeId}`, { method: 'DELETE' });
            buscarMembros(); // Atualiza a lista
        } catch (err) {
            console.error('Erro ao excluir mensalidade:', err);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;

        // Se quiser limitar caracteres no mês, pode adicionar aqui
        setNovaMensalidade(prev => ({ ...prev, [name]: value }));
    }

    return (
        
        <div className="p-6 max-w-3xl mx-auto">
            
            <h1 className="text-3xl font-bold mb-6 text-center">Zapata Red</h1>

            <h2 className="text-3xl font-bold mb-6">Membros e mensalidades</h2>

            {membros.length === 0 ? (
                <p>Nenhum membro encontrado.</p>
            ) : (
                <ul className="space-y-4">
                    {membros.map(membro => (
                        <li key={membro.id} className="p-4 border rounded shadow-sm bg-white">
                            {editandoId === membro.id ? (
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        name="apelido"
                                        value={formData.apelido}
                                        onChange={e =>
                                            setFormData(prev => ({ ...prev, apelido: e.target.value }))
                                        }
                                        placeholder="Apelido"
                                        className="w-full border rounded px-3 py-1"
                                    />
                                    <input
                                        type="text"
                                        name="nome"
                                        value={formData.nome}
                                        onChange={e =>
                                            setFormData(prev => ({ ...prev, nome: e.target.value }))
                                        }
                                        placeholder="Nome"
                                        className="w-full border rounded px-3 py-1"
                                    />
                                    <input
                                        type="text"
                                        name="telefone"
                                        value={formData.telefone}
                                        onChange={e =>
                                            setFormData(prev => ({ ...prev, telefone: e.target.value }))
                                        }
                                        placeholder="Telefone"
                                        className="w-full border rounded px-3 py-1"
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={e =>
                                            setFormData(prev => ({ ...prev, email: e.target.value }))
                                        }
                                        placeholder="Email"
                                        className="w-full border rounded px-3 py-1"
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => salvarEdicao(membro.id)}
                                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                                        >
                                            Salvar
                                        </button>
                                        <button
                                            onClick={cancelarEdicao}
                                            className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400 text-sm"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-start">
                                    <div>
                                        <strong className="text-xl">{membro.apelido}</strong>
                                        <br />
                                        Nome: <strong className="text-xl">{membro.nome}</strong>
                                        <br />
                                        Telefone: {membro.telefone}
                                        <br />
                                        Email: {membro.email || 'Não informado'}

                                        {membro.mensalidades?.length > 0 && (
                                            <ul className="mt-2 list-disc text-gray-700 pl-4">
                                                {membro.mensalidades.map(m => (
                                                    <li key={m.id} className="flex items-center gap-2">
                                                        <span>
                                                            {m.mes} — R$ {m.valor.toFixed(2)} — {m.pago ? '✅ Pago' : '❌ Pendente'}
                                                        </span>
                                                        <button
                                                            onClick={() => alternarStatusPago(m.id, !m.pago)}
                                                            className={`text-xs px-2 py-1 rounded ${m.pago ? 'bg-yellow-500 text-white' : 'bg-green-600 text-white'
                                                                }`}
                                                        >
                                                            {m.pago ? 'Desmarcar' : 'Marcar como Pago'}
                                                        </button>
                                                        <button
                                                            onClick={() => deletarMensalidade(m.id)}
                                                            className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                                                        >
                                                            Excluir
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => iniciarEdicao(membro)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => deletarMembro(membro.id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                                        >
                                            Excluir
                                        </button>
                                        <button
                                            onClick={() => abrirModalMensalidade(membro)}
                                            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                                        >
                                            + Mensalidade
                                        </button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {modalAberto && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-bold mb-4">
                            Nova mensalidade para {membroSelecionado?.apelido}
                        </h2>

                        <input
                            type="text"
                            name="mes"
                            placeholder="Mês (MM/YYYY)"
                            value={novaMensalidade.mes}
                            onChange={handleChange}
                            className={`w-full border px-3 py-2 mb-1 rounded ${erros.mes ? 'border-red-500' : ''
                                }`}
                        />
                        {erros.mes && <p className="text-red-600 text-sm mb-2">{erros.mes}</p>}

                        <input
                            type="number"
                            step="0.01"
                            name="valor"
                            placeholder="Valor"
                            value={novaMensalidade.valor}
                            onChange={handleChange}
                            className={`w-full border px-3 py-2 mb-1 rounded ${erros.valor ? 'border-red-500' : ''
                                }`}
                        />
                        {erros.valor && <p className="text-red-600 text-sm mb-2">{erros.valor}</p>}

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setModalAberto(false)}
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={async () => {
                                    await cadastrarMensalidade(membroSelecionado.id);
                                }}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
