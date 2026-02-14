import { useState, useEffect } from 'react';
import { TarjetaProducto } from '../components/TarjetaProducto';
import { Buscador } from '../components/buscador';
import { API_URL } from '../api'; // <--- 1. IMPORTAR

export function Inicio({ carrito, manejarAgregar, manejarQuitar, esAdmin }) {
  const [productos, setProductos] = useState([]); // 1. Empezamos vacíos
  const [busqueda, setBusqueda] = useState("");

// Este efecto se ejecuta:
// 1. Al inicio (busqueda está vacía) -> Trae todo
// 2. Cada vez que escribes algo -> Filtra en el servidor
useEffect(() => {
    const controller = new AbortController(); // Para cancelar peticiones viejas (Opcional pero Pro)

    // Construimos la URL: si hay texto, lo pegamos como query param
    const url = busqueda 
        //? `http://localhost:3000/api/productos?q=${busqueda}`
        //: 'http://localhost:3000/api/productos';

        ? `${API_URL}/api/productos?q=${busqueda}`
        : `${API_URL}/api/productos`;


    fetch(url, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => setProductos(data))
        .catch((err) => {
            if (err.name !== 'AbortError') console.error("Error:", err);
        });

    return () => controller.abort(); // Limpieza
}, [busqueda]); // <--- OJO: Dependencia [busqueda]

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-10 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
          Nuestra Colección
        </h2>

{/* COMPONENTE REUTILIZABLE */}
      {/* Le pasamos el estado (busqueda) y la función para cambiarlo (setBusqueda) */}
      <Buscador 
        valor={busqueda} 
        alBuscar={setBusqueda} 
      />

        
        {/* Mensaje de carga mientras llegan los datos */}
        {productos.length === 0 ? (
           <p className="mt-4 text-blue-500 font-medium animate-pulse">
             Cargando catálogo desde el servidor... ⏳
           </p>
        ) : (
           <p className="mt-4 text-xl text-gray-500">
             Conectado a Backend Express 🚀
           </p>
        )}
      </div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {productos.map((prod) => {
          const cantidadEnCarrito = carrito.filter(item => item.id === prod.id).length;
          return (
            <TarjetaProducto 
              key={prod.id} 
              producto={prod}
              cantidad={cantidadEnCarrito}
              alAgregar={() => manejarAgregar(prod)}
              alQuitar={() => manejarQuitar(prod)}
              esAdmin={esAdmin} // <--- 2. SE LO PASAMOS A LA TARJETA
            />
          );
        })}
      </div>
    </div>
  );
}