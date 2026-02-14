import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login({alEntrar}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook para movernos de página

  const handleLogin = (e) => {
    e.preventDefault();

    // 🔒 LA CONTRASEÑA SECRETA (En un proyecto real, esto va en variables de entorno)
    if (password === "admin123") {
      // ✅ Éxito: Guardamos el "token" falso en el navegador
// En lugar de hacer localStorage aquí, llamamos a la función de App.jsx
      alEntrar(); 
      navigate("/admin");
    } else {
      // ❌ Error
      setError("Contraseña incorrecta. Intruso detectado. 👮‍♂️");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Acceso Restringido 🔐</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Contraseña Maestra</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}

          <button 
            type="submit" 
            className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}