import { Outlet, useNavigate } from 'react-router-dom';

export default function LayoutTesouraria() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      {/* Logo Motoclube */}
      <header className="mb-4 w-full max-w-md flex items-center justify-between">
        <img
          src="/logo-motoclube.png" // ajuste para o caminho real da logo
          alt="Logo Motoclube"
          className="h-12"
        />
        {/* Botão para mudar para módulo Grife */}
        <button
          onClick={() => navigate('/grife')}
          className="bg-[#ec4303] text-white font-semibold rounded-md px-4 py-2 shadow-md hover:bg-[#d93b00]"
        >
          Ir para Grife
        </button>
      </header>

      {/* Título módulo */}
      <div className="mb-8 text-center w-full max-w-md">
        <h1 className="font-['Hellprint'] text-4xl font-bold text-[#ec4303] mb-1">Zapata Red</h1>
        <h2 className="font-['Hellprint'] text-2xl text-[#ec4303]">Tesouraria</h2>
      </div>

      {/* Navegação interna do módulo */}
      <nav className="flex gap-6 mb-10">
        <button
          onClick={() => navigate('/tesouraria/membros')}
          className="bg-orange-500 text-white font-semibold rounded-md px-6 py-3 shadow-md hover:bg-orange-600"
        >
          Membros
        </button>

        <button
          onClick={() => navigate('/tesouraria/mensalidades')}
          className="bg-orange-500 text-white font-semibold rounded-md px-6 py-3 shadow-md hover:bg-orange-600"
        >
          Mensalidades
        </button>
      </nav>

      {/* Conteúdo das páginas */}
      <main className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
        <Outlet />
      </main>
    </div>
  );
}
