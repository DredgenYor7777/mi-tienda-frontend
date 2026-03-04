import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilaProductoAdmin } from '../components/filaProductoAdmin';
import { API_URL } from '../api';

export function Admin() {
    // ==========================================
    // 🎛️ ESTADO GLOBAL DEL PANEL
    // ==========================================
    const navigate = useNavigate();
    // Controlamos qué pestaña está activa ('productos' o 'ventas')
    const [pestanaActiva, setPestanaActiva] = useState('ventas'); 

    // ==========================================
    // 📦 ESTADOS Y FUNCIONES: PRODUCTOS (INVENTARIO)
    // ==========================================
    const [productos, setProductos] = useState([]);
    const [form, setForm] = useState({ nombre: '', precio: '', descripcion: '', categoria: 'Ropa', imagen: '' });
    const [mensaje, setMensaje] = useState("");
    const [idEdicion, setIdEdicion] = useState(null);
    const [archivo, setArchivo] = useState(null);
    const [preview, setPreview] = useState(null);

    const cargarProductos = () => {
        fetch(`${API_URL}/api/productos`)
            .then(res => res.json())
            .then(data => setProductos(data))
            .catch(err => console.error(err));
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const prepararEdicion = (producto) => {
        setForm(producto);
        setIdEdicion(producto.id);
        setMensaje("✏️ Modo Edición activado");
    };

    const cancelarEdicion = () => {
        setForm({ nombre: '', precio: '', descripcion: '', categoria: 'Ropa', imagen: '' });
        setIdEdicion(null);
        setPreview(null);
        setMensaje("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const formData = new FormData();
        formData.append('nombre', form.nombre);
        formData.append('precio', form.precio);
        formData.append('descripcion', form.descripcion);
        formData.append('categoria', form.categoria);
        if (archivo) formData.append('imagen', archivo);

        try {
            let response;
            if (idEdicion) {
                response = await fetch(`${API_URL}/api/productos/${idEdicion}`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData,
                });
                setIdEdicion(null);
            } else {
                response = await fetch(`${API_URL}/api/productos`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData,
                });
            }

console.log("📡 Respuesta recibida del servidor. Status:", response.status);

            // 🔐 Verificar si el servidor nos rechazó
            if (response.status === 401 || response.status === 403) {
                console.error("🚨 REACT DETECTÓ UN 403. Abortando...");
                // COMENTAMOS EL REDIRECT TEMPORALMENTE PARA VER EL ERROR
                // alert("Tu sesión ha expirado o no tienes permisos. Vuelve a ingresar.");
                // localStorage.removeItem('token');
                // localStorage.removeItem('role');
                // localStorage.removeItem('usuario');
                // navigate('/login');
                return; 
            }

            if (response.ok) {
                setMensaje("✅ Guardado con éxito");
                cancelarEdicion();
                const fileInput = document.querySelector('input[type="file"]');
                if (fileInput) fileInput.value = "";
                cargarProductos();
            } else {
                setMensaje("❌ Error al guardar (Revisa los datos)");
            }
        } catch (error) {
            setMensaje("❌ Error de conexión");
        }
    };

    const eliminarProducto = async (id) => {
        if (!window.confirm("¿Borrar producto?")) return;
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/api/productos/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) setProductos(productos.filter(p => p.id !== id));
        } catch (e) { console.error(e); }
    };

    // ==========================================
    // 🚚 ESTADOS Y FUNCIONES: VENTAS (PEDIDOS)
    // ==========================================
    const [pedidos, setPedidos] = useState([]);

    const cargarPedidos = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('${API_URL}/api/admin/pedidos', {
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

    const marcarComoEnviado = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/api/admin/pedidos/${id}/estado`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ estado: 'enviado' })
            });
            if (response.ok) cargarPedidos();
        } catch (error) {
            console.error("Error al actualizar estado:", error);
        }
    };


   // ==========================================
    // 🛡️ SEGURIDAD INICIAL (CORREGIDA)
    // ==========================================
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        // Convertimos el rol a minúsculas por si en la BD dice "Admin" o "ADMIN"
        const rolNormalizado = role ? String(role).toLowerCase() : '';

        if (!token || rolNormalizado !== 'admin') {
            console.warn("Acceso denegado. Rol actual detectado:", role);
            navigate('/login');
        } else {
            cargarProductos();
            cargarPedidos();
        }
    }, [navigate]);

    // ==========================================
    // 🎨 RENDERIZADO VISUAL
    // ==========================================
    return (
        <div className="max-w-7xl mx-auto mt-10 p-4 sm:p-6 lg:px-8 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-black mb-6 text-slate-900 tracking-tight">Panel de Control 🛠️</h1>

            {/* 📑 PESTAÑAS (TABS) */}
            <div className="flex space-x-4 mb-8 border-b border-gray-200">
                <button 
                    onClick={() => setPestanaActiva('ventas')}
                    className={`pb-4 px-4 font-bold text-lg transition-colors border-b-4 ${pestanaActiva === 'ventas' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    📦 Gestión de Ventas
                </button>
                <button 
                    onClick={() => setPestanaActiva('productos')}
                    className={`pb-4 px-4 font-bold text-lg transition-colors border-b-4 ${pestanaActiva === 'productos' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    👟 Inventario de Productos
                </button>
            </div>

            {/* ======================================= */}
            {/* VISTA 1: VENTAS (PEDIDOS) */}
            {/* ======================================= */}
            {pestanaActiva === 'ventas' && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden fade-in">
                    <div className="p-6 border-b border-gray-100 bg-slate-900 text-white">
                        <h2 className="text-xl font-bold">Ventas Recientes</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                                    <th className="p-4 font-semibold">ID Ticket</th>
                                    <th className="p-4 font-semibold">Cliente</th>
                                    <th className="p-4 font-semibold">Fecha</th>
                                    <th className="p-4 font-semibold">Total</th>
                                    <th className="p-4 font-semibold">Estado</th>
                                    <th className="p-4 font-semibold text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pedidos.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-gray-500">
                                            Aún no hay ventas registradas. ¡Pronto llegarán! 💸
                                        </td>
                                    </tr>
                                ) : (
                                    pedidos.map((pedido) => (
                                        <tr key={pedido.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 font-bold text-gray-800">#{pedido.id}</td>
                                            <td className="p-4 text-gray-600">{pedido.email}</td>
                                            <td className="p-4 text-gray-500 text-sm">
                                                {new Date(pedido.creado_en).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 font-bold text-green-600">
                                                ${Number(pedido.total).toFixed(2)}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    pedido.estado === 'pagado' ? 'bg-blue-100 text-blue-700' : 
                                                    pedido.estado === 'enviado' ? 'bg-green-100 text-green-700' : 
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {pedido.estado.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                {pedido.estado === 'pagado' && (
                                                    <button 
                                                        onClick={() => marcarComoEnviado(pedido.id)}
                                                        className="bg-slate-900 text-white px-4 py-2 rounded shadow hover:bg-slate-800 transition-colors text-sm font-bold"
                                                    >
                                                        Marcar Enviado 📦
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ======================================= */}
            {/* VISTA 2: INVENTARIO (PRODUCTOS) */}
            {/* ======================================= */}
            {pestanaActiva === 'productos' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 fade-in">
                    {/* COLUMNA IZQUIERDA: FORMULARIO */}
                    <div className={`p-6 rounded-xl shadow-md h-fit transition-colors ${idEdicion ? 'bg-yellow-50 border border-yellow-200' : 'bg-white border border-gray-100'}`}>
                        <h2 className="text-xl font-bold mb-4">{idEdicion ? '✏️ Editando Producto' : '➕ Agregar Nuevo'}</h2>
                        {mensaje && <div className={`mb-4 p-3 text-sm rounded-lg font-medium ${mensaje.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{mensaje}</div>}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input name="nombre" placeholder="Nombre del producto" value={form.nombre} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            <input name="precio" type="number" placeholder="Precio ($)" value={form.precio} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            
                            <select name="categoria" value={form.categoria} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                <option value="Ropa">Ropa</option>
                                <option value="Accesorios">Accesorios</option>
                                <option value="Calzado">Calzado</option>
                                <option value="Electrónica">Electrónica</option>
                            </select>

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
                                <label className="cursor-pointer block">
                                    <span className="text-gray-600 font-medium">Sube una imagen</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            setArchivo(file);
                                            if (file) setPreview(URL.createObjectURL(file));
                                        }}
                                    />
                                    <div className="mt-2 flex justify-center">
                                        {preview ? (
                                            <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded shadow" />
                                        ) : idEdicion && form.imagen ? (
                                            <img src={form.imagen} alt="Actual" className="w-24 h-24 object-cover rounded shadow opacity-60" />
                                        ) : (
                                            <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center text-3xl">📷</div>
                                        )}
                                    </div>
                                </label>
                            </div>

                            <textarea name="descripcion" placeholder="Descripción breve..." value={form.descripcion} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none" />

                            <div className="flex gap-3">
                                <button type="submit" className={`flex-1 py-3 rounded-lg font-bold text-white shadow-md transition-transform active:scale-95 ${idEdicion ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-slate-900 hover:bg-slate-800'}`}>
                                    {idEdicion ? 'Guardar Cambios' : 'Crear Producto'}
                                </button>
                                {idEdicion && (
                                    <button type="button" onClick={cancelarEdicion} className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 font-bold text-gray-700 transition-colors">
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* COLUMNA DERECHA: LISTA */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 text-slate-800">Inventario Actual ({productos.length})</h2>
                        <div className="overflow-y-auto max-h-[600px] space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300">
                            {productos.map(prod => (
                                <FilaProductoAdmin
                                    key={prod.id}
                                    producto={prod}
                                    alEliminar={eliminarProducto}
                                    alEditar={prepararEdicion} 
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
}