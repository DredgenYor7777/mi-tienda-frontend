import { useNavigate, Link } from 'react-router-dom';

// 👇 ¡AQUÍ ESTÁ LA MAGIA! Recibimos las props (carrito, rol, manejarLogout)
export function Navbar({ carrito = [], rol, manejarLogout }) {
    const navigate = useNavigate();

    // 🧠 Calculamos el total de artículos y el dinero en tiempo real
    const totalArticulos = carrito.reduce((suma, item) => suma + Number(item.cantidad || 1), 0);
    const totalGlobal = carrito.reduce((suma, item) => suma + (Number(item.precio) * Number(item.cantidad || 1)), 0);

    return (
        <nav className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-md">
            <div className="flex items-center gap-8">
                <Link to="/" className="font-bold text-xl tracking-tighter">
                    CAMX <span className="text-blue-400">MiEcomm</span>
                </Link>

                <Link to="/" className="text-sm hover:text-blue-300 transition-colors">
                    Nuestra Colección
                </Link>
            </div>

            <div className="flex gap-6 items-center">
                {/* CARRITO: Solo se muestra si NO es Admin */}
                {rol !== 'admin' && (
                    <Link to="/carrito" className="relative hover:scale-110 transition-transform flex items-center gap-2 cursor-pointer">
                        <span className="text-2xl">🛒</span>

                        {/* 👇 La bolita roja ahora es DINÁMICA */}
                        {totalArticulos > 0 && (
                            <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {totalArticulos}
                            </span>
                        )}

                        {/* 👇 El precio total en el Navbar */}
                        {totalGlobal > 0 && (
                            <span className="ml-2 font-bold text-sm text-green-400">
                                ${totalGlobal.toFixed(2)}
                            </span>
                        )}
                    </Link>
                )}

                {/* LOGICA DE SESIÓN (Usando el rol que viene de App.jsx) */}
                {!rol ? (
                    <button
                        onClick={() => navigate('/login')}
                        className="text-sm font-medium hover:text-blue-400 transition-colors"
                    >
                        Iniciar Sesión
                    </button>
                ) : (
                    <div className="flex items-center gap-4 border-l border-gray-700 pl-4">
                        
                        {/* 👇 BOTÓN DE ADMIN (Solo si es jefe) */}
                        {rol === 'admin' && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                            >
                                Panel Admin 🛠️
                            </button>
                        )}

                        {/* 👇 BOTÓN DE CLIENTE (Solo si NO es jefe) */}
                        {rol === 'user' && (
                            <button
                                onClick={() => navigate('/mis-pedidos')}
                                className="text-sm font-bold text-blue-300 hover:text-blue-100 transition-colors"
                            >
                                Mis Pedidos 🛍️
                            </button>
                        )}

                        {/* 👇 Usamos la función de logout que viene de App.jsx */}
                        <button
                            onClick={manejarLogout}
                            className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                        >
                            Salir
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}