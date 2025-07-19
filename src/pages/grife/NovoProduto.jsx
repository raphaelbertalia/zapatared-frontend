import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../../utils/api';
import { fetchComToken } from '../../utils/fetchComToken';

export default function NovoProduto() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nome: '',
        tipo: 'CAMISETA_MANGA_CURTA',
        valorVenda: '', // valor único para o produto
    });

    const [variantes, setVariantes] = useState([{ tamanho: '' }]);

    const [erro, setErro] = useState('');
    const [produtosCadastrados, setProdutosCadastrados] = useState([]);

    const tamanhosCamiseta = ['P', 'M', 'G', 'GG', 'EXG', 'G1', 'G2', 'G3', 'G4', 'G5'];
    const tipoBone = 'único';

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    function atualizarVariante(i, campo, valor) {
        const novas = [...variantes];
        novas[i][campo] = valor;
        setVariantes(novas);
    }

    function adicionarVariante() {
        setVariantes([...variantes, { tamanho: '' }]);
    }

    function removerVariante(i) {
        const novas = [...variantes];
        novas.splice(i, 1);
        setVariantes(novas);
    }

    useEffect(() => {
        async function carregarProdutosCadastrados() {
            try {
                const res = await fetchComToken(`${API_BASE}/produtos`);
                if (res.ok) {
                    const data = await res.json();
                    setProdutosCadastrados(data);
                } else {
                    console.error('Erro ao carregar produtos cadastrados');
                }
            } catch (err) {
                console.error('Erro ao carregar produtos cadastrados:', err);
            }
        }
        carregarProdutosCadastrados();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');

        if (!form.nome || !form.tipo || !form.valorVenda) {
            setErro('Preencha todos os campos obrigatórios, incluindo o valor de venda.');
            return;
        }

        const isCamiseta = form.tipo.startsWith('CAMISETA');

        if (isCamiseta) {
            if (variantes.some(v => !v.tamanho)) {
                setErro('Preencha todos os tamanhos das variações.');
                return;
            }
        } else {
            if (variantes.length > 0) {
                setErro('Boné não deve ter variantes.');
                return;
            }
            if (!form.valorVenda || parseFloat(form.valorVenda) <= 0) {
                setErro('Informe um valor de venda válido para o boné.');
                return;
            }
        }

        try {
            const payload = isCamiseta
                ? {
                    nome: form.nome,
                    tipo: form.tipo,
                    valorVenda: parseFloat(form.valorVenda),
                    variantes: variantes.map(v => ({
                        tamanho: v.tamanho,
                        // sem precoVenda nem precoFornecedor
                    })),
                }
                : {
                    nome: form.nome,
                    tipo: form.tipo,
                    valorVenda: parseFloat(form.valorVenda),
                    // boné não tem variantes
                };

            const res = await fetchComToken(`${API_BASE}/produtos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Erro ao cadastrar produto');
            navigate('/grife/produtos');
        } catch (err) {
            console.error(err);
            setErro('Erro ao cadastrar. Tente novamente.');
        }
    }

    const isCamiseta = form.tipo.startsWith('CAMISETA');

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl font-bold text-[#ec4303] mb-4">Cadastrar Produto</h2>

            {erro && <p className="text-red-600 mb-4">{erro}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold">Nome</label>
                    <input
                        name="nome"
                        type="text"
                        value={form.nome}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold">Tipo</label>
                    <select
                        name="tipo"
                        value={form.tipo}
                        onChange={e => {
                            handleChange(e);
                            if (e.target.value === 'BONE') {
                                setVariantes([]); // boné não tem variantes
                            } else {
                                setVariantes([{ tamanho: '' }]);
                            }
                        }}
                        className="w-full p-2 border rounded"
                    >
                        <option value="CAMISETA_MANGA_CURTA">Camiseta Manga Curta</option>
                        <option value="CAMISETA_MANGA_LONGA">Camiseta Manga Longa</option>
                        <option value="CAMISETA_REGATA">Camiseta Regata</option>
                        <option value="BONE">Boné</option>
                    </select>
                </div>

                <div>
                    <label className="block font-semibold">Valor de Venda (R$)</label>
                    <input
                        name="valorVenda"
                        type="number"
                        step="0.01"
                        value={form.valorVenda}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                {isCamiseta && (
                    <div className="w-full flex justify-center">
                        <div className="flex flex-col items-center w-full max-w-md">
                            <label className="block font-semibold mb-2">Variações</label>

                            {variantes.map((v, i) => (
                                <div
                                    key={i}
                                    className="grid grid-cols-[1fr_auto] gap-2 items-center mb-2 w-full"
                                >
                                    <select
                                        value={v.tamanho}
                                        onChange={e => atualizarVariante(i, 'tamanho', e.target.value)}
                                        className="p-2 border rounded w-full"
                                    >
                                        <option value="">Tamanho</option>
                                        {tamanhosCamiseta.map(t => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>

                                    {variantes.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removerVariante(i)}
                                            className="text-red-600"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={adicionarVariante}
                                className="text-sm text-blue-600 mt-2"
                            >
                                + Adicionar variação
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex justify-between mt-6">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-[#ec4303] text-white px-6 py-2 rounded hover:bg-[#d93b00]"
                    >
                        Cadastrar
                    </button>
                </div>
            </form>

            <div className="mt-10">
                <h3 className="text-lg font-semibold mb-3 text-[#ec4303]">Produtos Cadastrados</h3>
                {produtosCadastrados.length > 0 ? (
                    <ul className="list-disc list-inside max-h-48 overflow-auto border p-3 rounded bg-gray-50">
                        {produtosCadastrados.map(p => (
                            <li key={p.id} className="text-gray-700">
                                {p.nome}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">Nenhum produto cadastrado ainda.</p>
                )}
            </div>
        </div>
    );
}
