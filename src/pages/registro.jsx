import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../api';

export function Registro() {
    const [form, setForm] = useState({ nombre: '', email: '', password: '' });
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (res.ok) {
                alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
                navigate('/login');
            } else {
                setMensaje(data.mensaje || "Error al registrar");
            }
        } catch (error) {
            setMensaje("Error de conexión");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="p-8 bg-white shadow-xl rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Crear Cuenta 🚀</h2>
                
                {mensaje && <p className="text-red-500 mb-4 text-center">{mensaje}</p>}

                <input name="nombre" placeholder="Nombre completo" onChange={handleChange} required 
                       className="w-full p-2 mb-4 border rounded" />
                
                <input name="email" type="email" placeholder="Correo electrónico" onChange={handleChange} required 
                       className="w-full p-2 mb-4 border rounded" />
                
                <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required 
                       className="w-full p-2 mb-6 border rounded" />

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">
                    Registrarse
                </button>
                
                <p className="mt-4 text-center text-sm">
                    ¿Ya tienes cuenta? <span onClick={() => navigate('/login')} className="text-blue-500 cursor-pointer">Inicia sesión</span>
                </p>
            </form>
        </div>
    );
}