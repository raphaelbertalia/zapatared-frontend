import { Outlet, useNavigate } from 'react-router-dom';

export default function LayoutGrife() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
            {/* Logo Motoclube */}
            <header className="mb-4 w-full max-w-md text-center">
                <img
                    src="/logo.png"
                    alt="Logo Motoclube"
                    style={{ height: '200px', width: 'auto', display: 'inline-block' }}
                />
            </header>
            <br />

            {/* Botão para mudar para módulo Tesouraria */}
            <button
                onClick={() => navigate('/tesouraria')}
                className="bg-[#ec4303] text-white font-semibold rounded-md px-4 py-2 shadow-md hover:bg-[#d93b00]"
            >
                Ir para Tesouraria
            </button>

            {/* Título módulo */}
            <div className="mb-8 text-center w-full max-w-md">
                <h1 className="font-['Hellprint'] text-4xl font-bold text-[#ec4303] mb-1">Zapata Red</h1>
                <h2 className="font-['Hellprint'] text-2xl text-[#ec4303]">Grife</h2>
            </div>

            {/* Navegação interna */}
            <nav className="flex gap-6 mb-10">
                <button
                    onClick={() => navigate('/grife/produtos')}
                    className="bg-yellow-500 text-white font-semibold rounded-md px-6 py-3 shadow-md hover:bg-yellow-600"
                >
                    Produtos
                </button>

                <button
                    onClick={() => {
                        console.log('Navegando para /grife/compras');
                        navigate('/grife/compras');
                    }}
                    className="bg-yellow-500 text-white font-semibold rounded-md px-6 py-3 shadow-md hover:bg-yellow-600"
                >
                    Compras
                </button>
            </nav>

            {/* Conteúdo das páginas */}
            <main className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
                <Outlet />
            </main>
        </div>
    );
}
