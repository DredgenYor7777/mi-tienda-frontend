import { useState, useEffect } from 'react';
import { FilaProductoAdmin } from '../components/filaProductoAdmin';
import { API_URL } from '../api'; // <--- 1. IMPORTAR

export function Admin() {
    const [productos, setProductos] = useState([]);
    const [form, setForm] = useState({ nombre: '', precio: '', descripcion: '', categoria: 'Ropa', imagen: '' });
    const [mensaje, setMensaje] = useState("");

    // NUEVO ESTADO: ¿Qué producto estoy editando? (null significa "ninguno, estoy creando")
    const [idEdicion, setIdEdicion] = useState(null);

    const [archivo, setArchivo] = useState(null); // Nuevo estado
    const [preview, setPreview] = useState(null);

    // ... (cargarProductos y handleChange siguen IGUAL) ...
    const cargarProductos = () => {
        /* ... tu código de fetch GET ... */
        //fetch('http://localhost:3000/api/productos')
        fetch(`${API_URL}/api/productos`)
            .then(res => res.json())
            .then(data => setProductos(data))
            .catch(err => console.error(err));
    };

    useEffect(() => { cargarProductos(); }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 1. FUNCIÓN PARA LLENAR EL FORMULARIO (Al dar click en el lápiz)
    const prepararEdicion = (producto) => {
        setForm(producto); // Pone los datos del producto en los inputs
        setIdEdicion(producto.id); // Guardamos el ID para saber a quién actualizar
        setMensaje("✏️ Modo Edición activado");
    };

    // 2. FUNCIÓN PARA CANCELAR (Botón de pánico)
    const cancelarEdicion = () => {
        setForm({ nombre: '', precio: '', descripcion: '', categoria: 'Ropa', imagen: '' });
        setIdEdicion(null);
        setPreview(null); // Limpiamos la previsualización
        setMensaje("");
    };

    // 3. EL SUPER SUBMIT (Decide si es POST o PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Crear un objeto FormData (Es como un sobre virtual para archivos)
        const formData = new FormData();
        formData.append('nombre', form.nombre);
        formData.append('precio', form.precio);
        formData.append('descripcion', form.descripcion);
        formData.append('categoria', form.categoria);

        // Solo agregamos la imagen si el usuario seleccionó una
        if (archivo) {
            formData.append('imagen', archivo);
        }

        try {
            // Nota: Quitamos el header 'Content-Type': 'application/json'
            // Fetch detecta automáticamente el FormData y pone el header correcto

            if (idEdicion) {
                // PUT
                await fetch(`http://localhost:3000/api/productos/${idEdicion}`, {
                    method: 'PUT',
                    body: formData, // <--- Enviamos el FormData
                });
                setIdEdicion(null);
            } else {
                // POST
                await fetch('http://localhost:3000/api/productos', {
                    method: 'POST',
                    body: formData, // <--- Enviamos el FormData
                });
            }

            // Limpieza
            setMensaje("✅ Guardado con éxito");
            setForm({ nombre: '', precio: '', descripcion: '', categoria: 'Ropa' });
            setArchivo(null); // Limpiamos el archivo
            setPreview(null); // Limpiamos la previsualización
            // Importante: Limpiar también el input visualmente (truco rápido: reload o ref)
            document.querySelector('input[type="file"]').value = "";
            cargarProductos();

        } catch (error) {
            setMensaje("❌ Error al subir");
        }
    };

    // ... (eliminarProducto sigue IGUAL) ...
    const eliminarProducto = async (id) => {
        /* ... tu código de delete ... */
        if (!window.confirm("¿Borrar?")) return;
        try {
            await fetch(`http://localhost:3000/api/productos/${id}`, { method: 'DELETE' });
            setProductos(productos.filter(p => p.id !== id));
        } catch (e) { console.error(e); }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Panel de Control 🛠️</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                {/* COLUMNA IZQUIERDA: FORMULARIO */}
                <div className={`p-6 rounded-lg shadow-md h-fit transition-colors ${idEdicion ? 'bg-yellow-50 border border-yellow-200' : 'bg-white'}`}>

                    <h2 className="text-xl font-bold mb-4">
                        {idEdicion ? '✏️ Editando Producto' : '➕ Agregar Nuevo'}
                    </h2>

                    {mensaje && <div className="mb-4 p-2 bg-blue-100 text-blue-700 text-sm rounded">{mensaje}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Inputs (Nombre, Precio, Categoria, Descripcion) IGUAL QUE ANTES */}
                        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required className="w-full p-2 border rounded bg-white" />
                        <input name="precio" type="number" placeholder="Precio" value={form.precio} onChange={handleChange} required className="w-full p-2 border rounded bg-white" />

                        <select name="categoria" value={form.categoria} onChange={handleChange} className="w-full p-2 border rounded bg-white">
                            <option value="Ropa">Ropa</option>
                            <option value="Accesorios">Accesorios</option>
                            <option value="Calzado">Calzado</option>
                            <option value="Electrónica">Electrónica</option>
                        </select>

                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Imagen del Producto</label>
                            
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setArchivo(file);

                                    // TRUCO DE MAGIA: Creamos una URL falsa local para verla ya
                                    if (file) {
                                        setPreview(URL.createObjectURL(file));
                                    }
                                }}
                                className="..."
                            />


                            {/* Justo debajo del input file */}

                            {/* CASO 1: Estamos subiendo una foto nueva (Preview) */}
                            {preview && (
                                <div className="mt-2">
                                    <p className="text-xs text-gray-500 mb-1">Vista previa:</p>
                                    <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-sm" />
                                </div>
                            )}

                            {/* CASO 2: No hay foto nueva, pero estamos editando uno que YA tenía foto */}
                            {!preview && idEdicion && form.imagen && (
                                <div className="mt-2">
                                    <p className="text-xs text-gray-500 mb-1">Imagen Actual:</p>
                                    <img src={form.imagen} alt="Actual" className="w-32 h-32 object-cover rounded-lg border border-gray-300 opacity-50" />
                                </div>
                            )}

    
                        </div>

                        <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} className="w-full p-2 border rounded bg-white h-20" />

                        {/* BOTONES DINÁMICOS */}
                        <div className="flex gap-2">
                            <button type="submit" className={`flex-1 py-2 rounded font-bold text-white ${idEdicion ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'}`}>
                                {idEdicion ? 'Actualizar Cambios' : 'Guardar Producto'}
                            </button>

                            {/* Botón Cancelar (Solo aparece si estamos editando) */}
                            {idEdicion && (
                                <button type="button" onClick={cancelarEdicion} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 font-bold text-gray-700">
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* COLUMNA DERECHA: LISTA */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Inventario Actual ({productos.length})</h2>
                    <div className="overflow-y-auto max-h-[500px] space-y-3 pr-2">
                        {productos.map(prod => (
                            <FilaProductoAdmin
                                key={prod.id}
                                producto={prod}
                                alEliminar={eliminarProducto}
                                alEditar={prepararEdicion} // <--- PASAMOS LA NUEVA FUNCIÓN
                            />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}