export function FilaProductoAdmin({ producto, alEliminar, alEditar }) { // <--- Nueva prop recibida
  return (
    <div className="flex justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      
      {/* Info del producto (Igual que antes) */}
      <div className="flex-1"> {/* Flex-1 para que ocupe espacio */}
        <p className="font-bold text-gray-800">{producto.nombre}</p>
        <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full mr-2">
          {producto.categoria}
        </span>
        <span className="text-sm text-green-600 font-bold">${producto.precio}</span>
      </div>

      {/* Botones de Acción (Ahora son dos) */}
      <div className="flex gap-2">
        {/* BOTÓN EDITAR */}
        <button 
          onClick={() => alEditar(producto)} // <--- Enviamos el producto completo hacia arriba
          className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 border border-blue-100 transition-all shadow-sm"
          title="Editar producto"
        >
          ✏️
        </button>

        {/* BOTÓN ELIMINAR */}
        <button 
          onClick={() => alEliminar(producto.id)}
          className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 border border-red-100 transition-all shadow-sm"
          title="Eliminar producto"
        >
          🗑️
        </button>
      </div>
      
    </div>
  );
}