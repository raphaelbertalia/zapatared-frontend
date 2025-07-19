import { useEffect, useState } from "react";
import { fetchComToken } from "../../utils/fetchComToken";
import { API_BASE } from "../../utils/api";

export default function RegistroCompras() {
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [produtoId, setProdutoId] = useState("");
  const [fornecedorId, setFornecedorId] = useState("");
  const [novoFornecedorNome, setNovoFornecedorNome] = useState("");
  const [mostrarNovoFornecedor, setMostrarNovoFornecedor] = useState(false);
  const [quantidade, setQuantidade] = useState("");
  const [valorUnitario, setValorUnitario] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const res = await fetchComToken(`${API_BASE}/produtos`);
        const data = await res.json();
        setProdutos(data);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
      }
    }

    async function carregarFornecedores() {
      try {
        const res = await fetchComToken(`${API_BASE}/fornecedores`);
        const data = await res.json();
        setFornecedores(data);
      } catch (err) {
        console.error("Erro ao carregar fornecedores:", err);
      }
    }

    carregarProdutos();
    carregarFornecedores();
  }, []);

  // Função para criar fornecedor novo inline
  async function criarNovoFornecedor() {
    if (!novoFornecedorNome.trim()) {
      setMensagem("Digite o nome do novo fornecedor.");
      return;
    }
    try {
      const res = await fetchComToken(`${API_BASE}/fornecedores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: novoFornecedorNome }),
      });

      if (!res.ok) throw new Error("Erro ao criar fornecedor");

      const fornecedorCriado = await res.json();

      // Atualiza lista e seleciona novo fornecedor
      setFornecedores((antigo) => [...antigo, fornecedorCriado]);
      setFornecedorId(fornecedorCriado.id.toString());
      setNovoFornecedorNome("");
      setMostrarNovoFornecedor(false);
      setMensagem("Fornecedor criado com sucesso!");
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao criar fornecedor.");
    }
  }

  async function registrarCompra() {
    if (!produtoId || !fornecedorId || !quantidade || !valorUnitario) {
      setMensagem("Preencha todos os campos.");
      return;
    }
    if (fornecedorId === "novo") {
      setMensagem("Finalize o cadastro do novo fornecedor antes de salvar a compra.");
      return;
    }
    try {
      const res = await fetchComToken(`${API_BASE}/compras`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          produtoId: parseInt(produtoId),
          fornecedorId: parseInt(fornecedorId),
          quantidade: parseInt(quantidade),
          valorUnitario: parseFloat(valorUnitario),
        }),
      });

      if (!res.ok) throw new Error("Erro na requisição");

      setMensagem("Compra registrada com sucesso!");
      setProdutoId("");
      setFornecedorId("");
      setQuantidade("");
      setValorUnitario("");
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao registrar compra.");
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Registrar Compra</h2>

      <div className="mb-4">
        <label className="block mb-1">Fornecedor</label>
        <select
          value={fornecedorId}
          onChange={(e) => {
            const val = e.target.value;
            setFornecedorId(val);
            setMostrarNovoFornecedor(val === "novo");
            setMensagem("");
          }}
          className="w-full p-2 border rounded"
        >
          <option value="">Selecione um fornecedor</option>
          {fornecedores.map((fornecedor) => (
            <option key={fornecedor.id} value={fornecedor.id}>
              {fornecedor.nome}
            </option>
          ))}
          <option value="novo">+ Novo fornecedor</option>
        </select>
      </div>

      {mostrarNovoFornecedor && (
        <div className="mb-4 p-4 border rounded bg-gray-50">
          <label className="block mb-1 font-semibold">Cadastrar Novo Fornecedor</label>
          <input
            type="text"
            placeholder="Nome do fornecedor"
            value={novoFornecedorNome}
            onChange={(e) => setNovoFornecedorNome(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={criarNovoFornecedor}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Salvar Fornecedor
          </button>
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-1">Produto</label>
        <select
          value={produtoId}
          onChange={(e) => setProdutoId(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Selecione um produto</option>
          {produtos.map((produto) => (
            <option key={produto.id} value={produto.id}>
              {produto.nome} - {produto.tamanho || "único"}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Quantidade</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Valor Unitário (R$)</label>
        <input
          type="number"
          step="0.01"
          className="w-full p-2 border rounded"
          value={valorUnitario}
          onChange={(e) => setValorUnitario(e.target.value)}
        />
      </div>

      {mensagem && <div className="mb-4 text-sm text-blue-600">{mensagem}</div>}

      <button
        onClick={registrarCompra}
        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
      >
        Salvar Compra
      </button>
    </div>
  );
}
