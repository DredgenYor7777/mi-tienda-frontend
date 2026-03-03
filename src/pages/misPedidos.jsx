import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function MisPedidos() {
    const [pedidos, setPedidos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Si no está logueado, lo mandamos fuera
            return;
        }

        const cargarMisPedidos = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/mis-pedidos', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setPedidos(data);
                }
            } catch (error) {
                console.error("Error al cargar pedidos:", error);
            }
        };

        cargarMisPedidos();
    }, [navigate]);

    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 min-h-[70vh]">
            <h1 className="text-3xl font-black mb-8 text-slate-900">Mi Historial de Compras 🛍️</h1>

            {pedidos.length === 0 ? (
                <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-xl font-bold text-gray-700 mb-2">Aún no tienes pedidos</h2>
                    <p className="text-gray-500 mb-6">Parece que tu clóset está esperando cosas nuevas.</p>
                    <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                        Ir de compras
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900 text-white text-sm uppercase tracking-wider">
                                    <th className="p-4 font-semibold">No. de Orden</th>
                                    <th className="p-4 font-semibold">Fecha</th>
                                    <th className="p-4 font-semibold">Total</th>
                                    <th className="p-4 font-semibold">Estado del Envío</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pedidos.map((pedido) => (
                                    <tr key={pedido.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-bold text-gray-800">#{pedido.id}</td>
                                        <td className="p-4 text-gray-600">
                                            {new Date(pedido.creado_en).toLocaleDateString('es-MX', {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </td>
                                        <td className="p-4 font-bold text-slate-900">
                                            ${Number(pedido.total).toFixed(2)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wide ${
                                                pedido.estado === 'pagado' ? 'bg-blue-100 text-blue-700' : 
                                                pedido.estado === 'enviado' ? 'bg-green-100 text-green-700' : 
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {pedido.estado === 'pagado' ? 'PREPARANDO 📦' : 
                                                 pedido.estado === 'enviado' ? 'EN CAMINO 🚚' : 
                                                 'PENDIENTE ⏳'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}