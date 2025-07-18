import { useState } from 'react';
import { IMaskInput } from 'react-imask';
import { useNavigate } from 'react-router-dom';

import { fetchComToken } from '../../utils/fetchComToken';
import { API_BASE } from '../../utils/api';

export default function CadastroMembro() {
  const [nome, setNome] = useState('');
  const [apelido, setApelido] = useState('');
  const [cpf, setCpf] = useState('');
  const [cpfValido, setCpfValido] = useState(true);
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('ativo');
  const [graduacao, setGraduacao] = useState('Camiseta');
  const [funcao, setFuncao] = useState('');
  const [mensagem, setMensagem] = useState('');

  const navigate = useNavigate();

  const graduacoes = [
    'Camiseta',
    'Próspero',
    'Meio Escudo',
    'Oficial',
    'Honrado',
    'Veterano',
  ];

  const validarCPF = (valor) => {
    const digits = valor.replace(/\D/g, '');
    if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false;

    const calcDig = (slice) =>
      (((slice
        .split('')
        .reduce((sum, num, idx) => sum + num * (slice.length + 1 - idx), 0) * 10) %
        11) %
      10);

    return (
      calcDig(digits.slice(0, 9)) === +digits[9] &&
      calcDig(digits.slice(0, 10)) === +digits[10]
    );
  };

  const handleCpfChange = (value) => {
    setCpf(value);
    setCpfValido(value.length === 14 ? validarCPF(value) : true);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validarCPF(cpf)) {
      setCpfValido(false);
      setMensagem('CPF inválido.');
      return;
    }

    const novoMembro = {
      nome,
      apelido,
      cpf,
      telefone,
      email,
      status,
      graduacao,
      funcao,
    };

    try {
      const res = await fetchComToken(`${API_BASE}/membros`, {
        method: 'POST',
        body: JSON.stringify(novoMembro),
      });
      if (!res || !res.ok) throw new Error('Erro ao cadastrar membro');

      setMensagem('Membro cadastrado com sucesso!');
      setNome('');
      setApelido('');
      setCpf('');
      setTelefone('');
      setEmail('');
      setCpfValido(true);
      setStatus('ativo');
      setGraduacao('Camiseta');
      setFuncao('');

      setTimeout(() => navigate('/membros'), 1500);
    } catch (err) {
      setMensagem('Erro ao cadastrar membro, tente novamente.');
      console.error(err);
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-xl w-full bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-4xl font-bold text-[#ec4303] mb-6 font-['Hellprint'] text-center">
          Cadastrar Novo Membro
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
          <Input label="Nome" value={nome} onChange={setNome} required />
          <Input label="Apelido" value={apelido} onChange={setApelido} required />

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
            <IMaskInput
              mask="000.000.000-00"
              value={cpf}
              onAccept={handleCpfChange}
              className={`w-full text-sm border px-3 py-1.5 rounded-xl focus:outline-none focus:ring-2 ${cpfValido ? 'border-gray-300 focus:ring-[#fff200]' : 'border-red-500 focus:ring-red-600'}`}
              placeholder="000.000.000-00"
              required
            />
            {!cpfValido && (
              <p className="text-red-600 text-sm mt-1">CPF inválido</p>
            )}
          </div>

          <Input label="Telefone" value={telefone} onChange={setTelefone} type="tel" required />
          <Input label="Email" value={email} onChange={setEmail} type="email" />

          <Select label="Graduação" value={graduacao} onChange={setGraduacao} options={graduacoes} />
          <Input label="Função" value={funcao} onChange={setFuncao} placeholder="Ex.: Tesoureiro, Diretor Social..." />

          <Select
            label="Status"
            value={status}
            onChange={setStatus}
            options={["ativo", "inativo", "isento", "afastado"]}
          />
            <br></br>
          <button
            type="submit"
            className="bg-[#ec4303] text-white py-2 px-4 rounded-2xl hover:brightness-110 transition font-bold text-sm"
            disabled={!cpfValido}
          >
            Cadastrar
          </button>

          <button
            type="button"
            onClick={() => navigate('/membros')}
            className="bg-gray-300 py-2 px-4 rounded-2xl hover:bg-gray-400 font-semibold text-sm"
          >
            Voltar
          </button>
        </form>

        {mensagem && <p className="mt-6 text-center font-semibold text-[#ec4303] text-sm">{mensagem}</p>}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = 'text', required = false, placeholder = '' }) {
  return (
    <div className="text-left">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full text-sm border px-3 py-1.5 rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#fff200]"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="text-left">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm border px-3 py-1.5 rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#fff200]"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
