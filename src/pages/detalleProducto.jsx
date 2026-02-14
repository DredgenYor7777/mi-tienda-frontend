import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_URL } from '../api'; // <--- 1. IMPORTAR

export function DetalleProducto({ manejarAgregar, esAdmin }) {
  const { id } = useParams();
  const [producto, setProducto] = useState(null); // Empezamos sin nada

  useEffect(() => {
    // Pedimos SOLO el producto con este ID
    //fetch(`http://localhost:3000/api/productos/${id}`)
    fetch(`${API_URL}/api/productos/${id}`)
      .then(res => res.json())
      .then(data => setProducto(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!producto) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-blue-600">
        ⏳ Buscando producto en la base de datos...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 mt-10">
      <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">
        ← Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">

        {/* Contenedor de la Imagen */}
        <div className="h-96 md:h-auto aspect-square bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden relative group">

          {producto.imagen ? (
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            // Fallback elegante
            <div className="flex flex-col items-center text-gray-300">
              <span className="text-6xl mb-2">📷</span>
              <span className="text-sm font-medium">Sin imagen</span>
            </div>
          )}

          {/* Etiqueta flotante (Opcional: Un toque pro) */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-600 shadow-sm">
            {producto.categoria}
          </div>

        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">{producto.nombre}</h1>
          <p className="text-sm text-gray-500 mt-2 uppercase tracking-wide">{producto.categoria}</p>
          <p className="mt-4 text-gray-700 leading-relaxed">{producto.descripcion}</p>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-3xl font-bold text-green-600">${producto.precio}</span>
            {/* LÓGICA DE ROLES */}
            {esAdmin ? (
              <Link
                to="/admin"
                className="bg-gray-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-900 transition-colors"
              >
                🔧 Gestionar Producto
              </Link>
            ) : (
              <button
                onClick={() => manejarAgregar(producto)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md"
              >
                Agregar al Carrito 🛒
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}