import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Importación de Páginas
import { Inicio } from './pages/Inicio';
import { DetalleProducto } from './pages/detalleProducto';
import { Carrito } from './pages/carrito';
import { Admin } from './pages/admin';
import { Login } from './pages/login';
import { Registro } from './pages/registro';
import { Navbar } from './components/navbar';
import { PagoExitoso } from './pages/pagoExitoso';
import { MisPedidos } from './pages/misPedidos';
import { API_URL } from './api';
// Importación de Componentes
import { RutaProtegida } from './components/rutaProtegida';

function App() {
  // 1. ESTADO DE AUTENTICACIÓN Y ROLES 🔐ñ
  const [rol, setRol] = useState(localStorage.getItem("role"));

  const manejarLogin = (nuevoRol) => {
    setRol(nuevoRol); // Actualiza el estado global de la app
  };

  const manejarLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("usuario");
    // 👇 NUEVO: Destruir el carrito al salir
    localStorage.removeItem("mi-carrito");
    setRol(null);
    window.location.href = "/"; // Limpieza total
  };

  // 2. ESTADO DEL CARRITO (Persistente en LocalStorage) 🛒
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem('mi-carrito');
    return guardado ? JSON.parse(guardado) : [];
  });

  useEffect(() => {
    localStorage.setItem('mi-carrito', JSON.stringify(carrito));
  }, [carrito]);


  // 👇 NUEVO: EFECTO PARA DESCARGAR EL CARRITO DE LA NUBE
  useEffect(() => {
    const token = localStorage.getItem('token');

    // Solo buscamos en la base de datos si hay alguien logueado y NO es admin
    if (token && rol !== 'admin') {
      const cargarCarritoDeLaNube = async () => {
        try {
          const response = await fetch(`${API_URL}/api/carrito`, {
            headers: {
              'Authorization': `Bearer ${token}` // Llevamos nuestra llave
            }
          });

          if (response.ok) {
            const datosDelCarrito = await response.json();
            // Sobrescribimos el carrito local con lo que hay en la base de datos
            setCarrito(datosDelCarrito);
            console.log("🛒 Carrito descargado de la nube:", datosDelCarrito);
          }
        } catch (error) {
          console.error("Error al descargar el carrito:", error);
        }
      };

      cargarCarritoDeLaNube();
    }
  }, [rol]); // 👈 Este [rol] es clave: le dice a React que ejecute esto cada vez que alguien hace Login o Logout.

  const manejarAgregar = async (producto) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Debes iniciar sesión para agregar al carrito 🛑");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/carrito`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          producto_id: producto.id,
          cantidad: 1
        })
      });

      if (response.ok) {
        // 👇 LA MAGIA: Actualizamos el carrito local de forma inteligente
        setCarrito((prevCarrito) => {
          const index = prevCarrito.findIndex((item) => item.id === producto.id);

          if (index !== -1) {
            // Si ya existe, le sumamos 1 a su cantidad local
            const nuevoCarrito = [...prevCarrito];
            nuevoCarrito[index] = {
              ...nuevoCarrito[index],
              cantidad: Number(nuevoCarrito[index].cantidad || 1) + 1
            };
            return nuevoCarrito;
          } else {
            // Si es nuevo, lo agregamos forzando la cantidad a 1
            return [...prevCarrito, { ...producto, cantidad: 1 }];
          }
        });
        console.log("¡Producto guardado en la base de datos! ☁️");
      }
    } catch (error) {
      console.error("Error de conexión 🔌", error);
    }
  };

  const manejarQuitar = async (productoOId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const idABuscar = typeof productoOId === 'object' ? productoOId.id : productoOId;
    const indice = carrito.findIndex((item) => item.id === idABuscar);

    if (indice === -1) return;

    const productoActual = carrito[indice];
    // Forzamos a que sea un número para evitar el 'undefined'
    const cantidadActual = Number(productoActual.cantidad || 1);

    try {
      // 🟢 CASO A: Aún quedan más de 1 (Mandamos PUT)
      if (cantidadActual > 1) {
        const response = await fetch(`${API_URL}/api/carrito/${idABuscar}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ cantidad: cantidadActual - 1 })
        });

        if (response.ok) {
          const nuevoCarrito = [...carrito];
          nuevoCarrito[indice] = { ...productoActual, cantidad: cantidadActual - 1 };
          setCarrito(nuevoCarrito);
        }

      }
      // 🔴 CASO B: Solo queda 1 (Mandamos DELETE)
      else {
        const response = await fetch(`${API_URL}/api/carrito/${idABuscar}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const nuevoCarrito = [...carrito];
          nuevoCarrito.splice(indice, 1);
          setCarrito(nuevoCarrito);
        }
      }
    } catch (error) {
      console.error("Error al comunicarse con el servidor:", error);
    }
  };


  // 👇 NUEVA FUNCIÓN: Vacía todo tras la compra
  const vaciarCarrito = async () => {
    setCarrito([]); // 1. Limpiamos la pantalla al instante

    const token = localStorage.getItem('token');
    if (token) {
      try {
        // 2. Le avisamos a la Base de Datos que borre todo
        await fetch(`${API_URL}/api/carrito`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (error) {
        console.error("Error al vaciar BD", error);
      }
    }
  };

  // AQUI FORZAMOS A QUE EL PRECIO SEA UN NÚMERO ANTES DE SUMARLO
  // AQUI MULTIPLICAMOS EL PRECIO POR LA CANTIDAD
  const totalGlobal = carrito.reduce((suma, item) => suma + (Number(item.precio) * Number(item.cantidad || 1)), 0);

  // 👇 NUEVO: Calculamos el total de ARTÍCULOS (sumando las cantidades)
  const totalArticulos = carrito.reduce((suma, item) => {
    return suma + Number(item.cantidad || 1);
  }, 0);

  return (
    <BrowserRouter>
      {/* NAVBAR GLOBAL */}
      {/* 👇 Usamos tu componente limpio y le PASAMOS los datos (Props) */}
      <Navbar
        carrito={carrito}
        rol={rol}
        manejarLogout={manejarLogout}
      />
      {/* RUTAS DE LA APLICACIÓN */}
      <Routes>
        <Route path="/" element={
          <Inicio
            carrito={carrito}
            manejarAgregar={manejarAgregar}
            manejarQuitar={manejarQuitar}
            rol={rol}
          />
        } />

        <Route path="/carrito" element={
          <Carrito
            carrito={carrito}
            total={totalGlobal}
            manejarQuitar={manejarQuitar}
          />
        } />

        <Route path="/login" element={<Login alEntrar={manejarLogin} />} />

        <Route path="/registro" element={<Registro />} />

        {/* 👇 Dejamos a Admin solito, él ya sabe defenderse */}
        <Route path="/admin" element={<Admin />} />

        <Route path="/producto/:id" element={
          <DetalleProducto
            manejarAgregar={manejarAgregar}
            rol={rol}
          />
        } />

        {/* Agrega esta línea en tu bloque de Routes */}
        <Route path="/pago-exitoso" element={<PagoExitoso vaciarCarrito={vaciarCarrito} />} />

        <Route path="/mis-pedidos" element={<MisPedidos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;