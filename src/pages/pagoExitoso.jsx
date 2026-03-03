import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export function PagoExitoso({ vaciarCarrito }) {
    // Esto nos permite leer el "?session_id=..." de la URL
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    
    // Un estado para saber si ya terminamos de avisarle al backend
    const [confirmado, setConfirmado] = useState(false);

    useEffect(() => {
        // 1. Vaciamos el carrito visual y de la base de datos local
        vaciarCarrito();

        // 2. Le avisamos al Backend que este recibo ya se pagó
        const confirmarPagoEnBD = async () => {
            if (sessionId) {
                const token = localStorage.getItem('token');
                try {
                    const response = await fetch('http://localhost:3000/api/confirmar-pago', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ session_id: sessionId })
                    });

                    if (response.ok) {
                        console.log("¡El backend confirmó el pago! ✅");
                        setConfirmado(true);
                    }
                } catch (error) {
                    console.error("Error al confirmar con el backend", error);
                }
            }
        };

        confirmarPagoEnBD();
    }, [sessionId]); // Se ejecuta cuando detecta el sessionId en la URL

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border-t-8 border-green-500">
                <div className="text-8xl mb-6">🎉</div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">¡Pago Exitoso!</h1>
                
                {/* Mostramos un mensajito extra si el backend ya lo aprobó */}
                {confirmado ? (
                    <p className="text-green-600 font-bold mb-8">
                        Tu pedido ha sido registrado y marcado como PAGADO en el sistema. 📦
                    </p>
                ) : (
                    <p className="text-gray-500 mb-8 font-medium">
                        Procesando tu orden... Te enviaremos un correo con los detalles del envío.
                    </p>
                )}
                
                <Link 
                    to="/" 
                    className="inline-block w-full bg-slate-900 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-800 transition-colors"
                >
                    Volver a la tienda
                </Link>
            </div>
        </div>
    );
}