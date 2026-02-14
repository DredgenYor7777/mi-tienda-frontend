import { Link } from 'react-router-dom';

export function TarjetaProducto({ producto, cantidad, alAgregar, alQuitar, esAdmin }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 flex flex-col justify-between h-full">

      {/* --- PARTE 1: VISIBLE PARA TODOS (Imagen y Datos) --- */}
      <div>
        {/* IMAGEN */}
        <Link to={`/producto/${producto.id}`}>
          <div className="h-48 overflow-hidden relative group bg-gray-100">
            {producto.imagen ? (
              <img 
                src={producto.imagen} 
                alt={producto.nombre} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">📷</div>
            )}
          </div>
        </Link>

        {/* INFO DEL PRODUCTO */}
        <div className="p-4">
          <Link to={`/producto/${producto.id}`}>
            <h3 className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors mb-1">
              {producto.nombre}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mb-2">{producto.categoria}</p>
          <p className="text-2xl font-extrabold text-green-600">${producto.precio}</p>
        </div>
      </div>

      {/* --- PARTE 2: LÓGICA DIVIDIDA (Admin vs Cliente) --- */}
      <div className="p-4 pt-0 mt-auto">
        
        {esAdmin ? (
          // 🔴 CAMINO A: SI ERES ADMIN
          // Solo ves el botón de editar. NADA MÁS.
          <Link 
            to="/admin" 
            className="block w-full text-center bg-yellow-100 text-yellow-700 font-bold py-2 rounded-lg hover:bg-yellow-200 transition-colors border border-yellow-200"
          >
            ✏️ Editar en Panel
          </Link>

        ) : (
          // 🟢 CAMINO B: SI ERES CLIENTE
          // Ves botones de compra Y el subtotal. Todo junto aquí.
          <>
            {/* Botones de Agregar/Quitar */}
            {cantidad === 0 ? (
              <button 
                onClick={alAgregar}
                className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Agregar al Carrito 🛒
              </button>
            ) : (
              <div className="flex items-center justify-between bg-blue-50 rounded-lg p-1 border border-blue-100">
                 <button onClick={alQuitar} className="w-10 h-10 bg-white text-blue-600 rounded shadow-sm font-bold hover:bg-gray-50">-</button>
                 <span className="font-bold text-blue-800">{cantidad}</span>
                 <button onClick={alAgregar} className="w-10 h-10 bg-blue-600 text-white rounded shadow-sm font-bold hover:bg-blue-700">+</button>
              </div>
            )}

            {/* Subtotal (DENTRO del bloque de Cliente) */}
            {cantidad > 0 && (
              <div className="mt-3 text-center bg-gray-50 p-2 rounded border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold">Subtotal</p>
                <p className="text-blue-700 font-bold text-lg">
                  ${cantidad * producto.precio}
                </p>
              </div>
            )}
          </>
        )}

      </div>

    </div>
  );
}