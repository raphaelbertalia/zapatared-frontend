import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchComToken } from '../../utils/fetchComToken';
import { API_BASE } from '../../utils/api';

const tipoDisplay = {
    CAMISETA_MANGA_CURTA: 'Camiseta Manga Curta',
    CAMISETA_MANGA_LONGA: 'Camiseta Manga Longa',
    CAMISETA_REGATA: 'Camiseta Regata',
    BONE: 'Boné',
};

export default function Produtos() {
    const [produtos, setProdutos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function carregarProdutos() {
            try {
                const res = await fetchComToken(`${API_BASE}/produtos`);
                const data = await res.json();
                setProdutos(data);
            } catch (err) {
                console.error('Erro ao carregar produtos:', err);
            }
        }
        carregarProdutos();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#ec4303]">Produtos</h2>
                <button
                    onClick={() => navigate('/grife/novo-produto')}
                    className="bg-[#ec4303] text-white px-4 py-2 rounded-md hover:bg-[#d93b00]"
                >
                    Cadastrar Produto
                </button>
            </div>

            <div className="grid gap-4">
                {produtos.length > 0 ? (
                    produtos.map((produto) => {
                        let variantesParaTabela = [];

                        if (produto.tipo === 'BONE') {
                            variantesParaTabela = [
                                {
                                    id: 'bone-' + produto.id,
                                    tamanho: '-',
                                    subtipo: tipoDisplay[produto.tipo],
                                    precoVenda: produto.valorVenda ?? 0,
                                },
                            ];
                        } else {
                            variantesParaTabela = produto.variantes ?? [];
                        }

                        return (
                            <div
                                key={produto.id}
                                className="p-4 border rounded-lg shadow-sm bg-gray-50 text-left"
                            >
                                <h3 className="text-lg font-semibold mb-2">{produto.nome}</h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    Tipo: {tipoDisplay[produto.tipo] || produto.tipo}
                                </p>

                                <div className="mt-4">
                                    <p className="font-semibold mb-2">Variações:</p>
                                    {variantesParaTabela.length > 0 ? (
                                        <table className="w-full border-collapse text-sm">
                                            <thead>
                                                <tr>
                                                    <th className="border px-3 py-1 text-left bg-gray-100">Tamanho</th>
                                                    <th className="border px-3 py-1 text-left bg-gray-100">Tipo</th>
                                                    <th className="border px-3 py-1 text-right bg-gray-100">Venda (R$)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {variantesParaTabela.map((v) => (
                                                    <tr key={v.id}>
                                                        <td className="border px-3 py-1">{v.tamanho || '-'}</td>
                                                        <td className="border px-3 py-1">
                                                            {v.subtipo || tipoDisplay[produto.tipo] || '-'}
                                                        </td>
                                                        <td className="border px-3 py-1 text-right">
                                                            {Number(v.precoVenda ?? produto.valorVenda ?? 0).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p className="text-gray-500">Sem variações cadastradas.</p>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-500">Nenhum produto cadastrado ainda.</p>
                )}
            </div>
        </div>
    );
}
