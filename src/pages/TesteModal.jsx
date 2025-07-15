import React, { useState } from 'react';

export default function TesteModal() {
  const membroExemplo = { id: 1, apelido: 'Zapata' };

  const [modalAberto, setModalAberto] = useState(false);
  const [membroSelecionado, setMembroSelecionado] = useState(null);

  function abrirModal(membro) {
    console.log('Abrindo modal para:', membro.apelido);
    setMembroSelecionado(membro);
    setModalAberto(true);
  }

  return (
    <div style={{ padding: 20 }}>
      <button
        onClick={() => abrirModal(membroExemplo)}
        style={{ padding: '8px 16px', backgroundColor: '#1d4ed8', color: 'white', borderRadius: 4, border: 'none' }}
      >
        + Mensalidade
      </button>

      {modalAberto && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <div style={{ backgroundColor: 'white', padding: 20, borderRadius: 8, width: 300 }}>
            <h2>Nova mensalidade para {membroSelecionado?.apelido}</h2>
            <button
              onClick={() => setModalAberto(false)}
              style={{ marginTop: 20, padding: '6px 12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: 4 }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}