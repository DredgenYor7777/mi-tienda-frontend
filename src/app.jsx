import { useState, useEffect } from 'react';
// 1. Importamos las herramientas de Rutas
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Inicio } from './pages/Inicio';
import { DetalleProducto } from './pages/detalleProducto';
import { Carrito } from './pages/carrito'; // Importamos la nueva página
import { Admin } from './pages/admin'
import { Login } from './pages/login';
import { RutaProtegida } from './components/rutaProtegida';

function App() {
  // === AQUI MOVEMOS TODA LA LÓGICA QUE ESTABA EN INICIO ===

  const [esAdmin, setEsAdmin] = useState(!!localStorage.getItem("esAdmin"));
  // 2. FUNCIÓN PARA ENTRAR (Se la pasaremos al Login)
  const manejarLogin = () => {
    localStorage.setItem("esAdmin", "true"); // Guardar en disco
    setEsAdmin(true); // Avisar a React (Esto actualiza el Navbar)
  };

  // 3. FUNCIÓN PARA SALIR (La usará el Navbar)
  const manejarLogout = () => {
    localStorage.removeItem("esAdmin"); // Borrar de disco
    setEsAdmin(false); // Avisar a React
    window.location.href = "/"; // Recargar para ir al inicio limpio
  };

  // 1. Estado y Persistencia
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem('mi-carrito');
    return guardado ? JSON.parse(guardado) : [];
  });

  useEffect(() => {
    localStorage.setItem('mi-carrito', JSON.stringify(carrito));
  }, [carrito]);

  // 2. Lógica de agregar/quitar
  const manejarAgregar = (producto) => {
    setCarrito([...carrito, producto]);
  };

  const manejarQuitar = (producto) => {
    const indice = carrito.findIndex((item) => item.id === producto.id);
    if (indice !== -1) {
      const nuevoCarrito = [...carrito];
      nuevoCarrito.splice(indice, 1);
      setCarrito(nuevoCarrito);
    }
  };

  // 3. Cálculos
  const totalGlobal = carrito.reduce((suma, item) => suma + item.precio, 0);


  // === AQUI EMPIEZA LA NAVEGACIÓN (UI) ===
  return (
    <BrowserRouter>
      {/* NAVBAR GLOBAL (Se ve en todas las páginas) */}
      {/* NAVBAR */}
      <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-2xl">🇨🇦🇲🇽</span>
              <span className="font-bold text-xl tracking-wide">MiEcomm</span>
            </Link>


            {/* LÓGICA: Si NO es admin (!esAdmin), mostramos el carrito */}
            {!esAdmin && (
              <Link to="/carrito" className="relative group">
                <span className="text-2xl">🛒</span>
                {/* Badge con cantidad */}
                {carrito.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {carrito.length}
                  </span>
                )}
                {/* Total en dinero */}
                <div className="hidden group-hover:block absolute right-0 top-8 bg-slate-800 text-white text-xs p-1 rounded w-max">
                  Total: ${carrito.reduce((sum, item) => sum + item.precio, 0)}
                </div>
              </Link>
            )}


            {/* AHORA USAMOS EL ESTADO (esAdmin) EN LUGAR DE LOCALSTORAGE DIRECTO */}
            {esAdmin ? (
              <button
                onClick={manejarLogout}
                className="text-red-400 hover:text-red-300 font-bold ml-4"
              >
                Salir 🚪
              </button>
            ) : (
              <Link to="/login" className="text-gray-300 hover:text-white ml-4">Soy Admin</Link>
            )}


          </div>
        </div>
      </nav>

      {/* EL CAMBIADOR DE PÁGINAS (Switch) */}
      <Routes>

        {/* Pasamos la prop "esAdmin" a Inicio */}
        <Route
          path="/"
          element={
            <Inicio
              carrito={carrito}
              manejarAgregar={manejarAgregar}
              manejarQuitar={manejarQuitar}
              esAdmin={esAdmin} // <--- NUEVA PROP
            />
          }
        />



        {/* RUTA 2: El Carrito (Checkout) */}
        <Route path="/carrito" element={
          <Carrito carrito={carrito} total={totalGlobal} 

          

          />
        } />


        {/* PASAMOS LA FUNCIÓN manejarLogin AL COMPONENTE LOGIN */}
        <Route path="/login" element={<Login alEntrar={manejarLogin} />} />

        <Route
          path="/admin"
          element={
            <RutaProtegida>
              <Admin />
            </RutaProtegida>
          }
        />

        {/* LA NUEVA RUTA DINÁMICA */}
        {/* :id significa "aquí va cualquier cosa y la guardaré en una variable llamada id" */}
        {/* Pasamos la prop "esAdmin" a DetalleProducto */}
        <Route
          path="/producto/:id"
          element={
            <DetalleProducto
              manejarAgregar={manejarAgregar}
              esAdmin={esAdmin} // <--- NUEVA PROP
            />
          }
        />

        <Route path="/admin" element={<Admin />} />



      </Routes>
    </BrowserRouter>
  );
}

export default App;