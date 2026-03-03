import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../api'; // Usamos tu constante de API

export function Login({ alEntrar }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 1. Guardar Token y datos esenciales
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        
        // 🕵️‍♂️ EL TRUCO: Buscamos "rol" (español) o "role" (inglés) por si acaso
        const rolDelUsuario = data.usuario.rol || data.usuario.role;

        // 2. 🔑 GUARDAR EL ROL
        localStorage.setItem('role', rolDelUsuario);

        // 3. Notificar a App.jsx pasando el rol
        alEntrar(rolDelUsuario); 

        // 4. Redirección inteligente (Asegurando que sea minúscula)
        if (String(rolDelUsuario).toLowerCase() === 'admin') {
            navigate("/admin"); // Si es jefe, al panel
        } else {
            navigate("/"); // Si es cliente, al catálogo
        }

      } else {
        setError(data.mensaje || "Credenciales incorrectas");
      }

    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor 🔌");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Acceso Seguro 🔐</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none transition-all"
              placeholder="admin@tienda.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded text-sm text-center font-medium">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-slate-900 text-white py-2 rounded hover:bg-black transition-colors font-bold shadow-md active:scale-95"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes cuenta? <span onClick={() => navigate('/registro')} className="text-blue-600 font-bold cursor-pointer hover:underline">Regístrate aquí</span>
        </p>
      </div>
    </div>
  );
}