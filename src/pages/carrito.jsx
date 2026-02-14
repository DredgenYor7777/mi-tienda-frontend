import { Link } from 'react-router-dom'; // Importamos el "link" mágico

export function Carrito({ carrito, total }) {
  return (
    <div style={{ padding: '40px' }}>
      <h1>Tu Carrito de Compras 🛍️</h1>
      
      {carrito.length === 0 ? (
        <div>
          <p>Tu carrito está vacío.</p>
          {/* Link es como la etiqueta <a> de HTML, pero no recarga la página */}
          <Link to="/">Volver a la Tienda</Link>
        </div>
      ) : (
        <div>
          {/* Lista simple de lo comprado */}
          <ul>
            {carrito.map((item, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                {item.nombre} - <strong>${item.precio}</strong>
              </li>
            ))}
          </ul>
          
          <h3>Total a Pagar: ${total} MXN</h3>
          
          <button style={{ padding: '10px 20px', background: 'green', color: 'white', border: 'none' }}>
            Proceder al Pago
          </button>
          
          <br /><br />
          <Link to="/">Seguir comprando</Link>
        </div>
      )}
    </div>
  );
}