import { Link } from 'react-router-dom';

export function Carrito({ carrito = [], total = 0, manejarQuitar }) {


  // 👇 NUEVA FUNCIÓN: Envía el carrito al backend para generar el cobro
    const manejarPago = async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            alert("Por favor inicia sesión para continuar con el pago 🔒");
            return;
        }

        try {
            // Le pedimos al backend que cree la "Caja Registradora" de Stripe
            const response = await fetch('http://localhost:3000/api/crear-sesion-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Nuestra llave de seguridad
                },
                body: JSON.stringify({ carrito }) // Enviamos lo que vamos a comprar
            });

            const data = await response.json();

            if (response.ok && data.url) {
                // 🚀 ¡MAGIA! Redirigimos al cliente a la página segura de Stripe
                window.location.href = data.url;
            } else {
                console.error("Error desde el servidor:", data);
                alert("Hubo un problema al procesar tu solicitud de pago.");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("No se pudo conectar con el servidor.");
        }
    };
    
    // 🪹 ESTADO 1: Si el carrito está vacío, mostramos un mensaje amigable
    if (carrito.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] bg-gray-50">
                <span className="text-6xl mb-4">🛒</span>
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Tu carrito está vacío</h2>
                <p className="text-gray-500 mb-6">¡Parece que aún no has elegido tus tenis favoritos!</p>
                <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md">
                    Ir a la tienda
                </Link>
            </div>
        );
    }

    // 🛍️ ESTADO 2: Si hay productos, mostramos la interfaz de pago (Checkout)
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-black mb-8 text-slate-900 tracking-tight">Tu Carrito de Compras</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 📝 SECCIÓN IZQUIERDA: Lista de Productos */}
                <div className="lg:col-span-2 space-y-4">
                    {carrito.map((item) => (
                        <div key={item.id} className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md">
                            
                            {/* Imagen del producto */}
                            <img 
                                src={item.imagen} 
                                alt={item.nombre} 
                                className="w-24 h-24 object-cover rounded-lg bg-gray-100" 
                            />
                            
                            {/* Detalles */}
                            <div className="ml-4 flex-1">
                                <h3 className="text-lg font-bold text-gray-800">{item.nombre}</h3>
                                <p className="text-sm text-gray-500">{item.categoria}</p>
                                
                                <div className="mt-2 flex items-center gap-4">
                                    <span className="font-bold text-blue-600 text-lg">
                                        ${Number(item.precio).toFixed(2)}
                                    </span>
                                    <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">
                                        Cant: {item.cantidad || 1}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Botón Eliminar */}
                            <button 
                                onClick={() => manejarQuitar(item.id)}
                                className="text-gray-400 hover:text-red-500 p-2 font-bold text-xl transition-colors"
                                title="Eliminar producto"
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>

                {/* 💳 SECCIÓN DERECHA: Resumen de Compra (Pegajoso al hacer scroll) */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit sticky top-24">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Resumen del Pedido</h2>
                    
                    <div className="space-y-3 text-gray-600 mb-6">
                        <div className="flex justify-between">
                            <span>Subtotal ({carrito.reduce((sum, item) => sum + Number(item.cantidad || 1), 0)} artículos)</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Costo de Envío</span>
                            <span className="text-green-500 font-bold tracking-wide">¡GRATIS!</span>
                        </div>
                    </div>
                    
                    <div className="flex justify-between text-2xl font-black text-slate-900 mb-6 pt-4 border-t border-dashed border-gray-300">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    
                    {/* El Botón Mágico hacia la Pasarela */}
   {/* El Botón Mágico hacia la Pasarela */}
                    <button 
                        onClick={manejarPago} // 👈 AQUI CAMBIAMOS
                        className="w-full bg-slate-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-600 transition-colors shadow-lg active:scale-95 flex justify-center items-center gap-2"
                    >
                        Proceder al Pago 💳
                    </button>
                    
                    <div className="mt-4 flex justify-center gap-2 text-2xl grayscale opacity-60">
                        {/* Iconos de tarjetas simulados */}
                        💳 🏦 📱
                    </div>
                </div>

            </div>
        </div>
    );
}