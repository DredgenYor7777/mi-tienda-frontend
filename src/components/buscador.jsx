export function Buscador({ valor, alBuscar }) {
  return (
    <div className="max-w-md mx-auto mt-6 relative">
      {/* Icono decorativo */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="text-gray-400">🔍</span>
      </div>
      
      <input 
        type="text"
        placeholder="Buscar producto..."
        value={valor} // <--- CONTROLADO POR EL PADRE
        onChange={(e) => alBuscar(e.target.value)} // <--- AVISAMOS AL PADRE
        className="w-full p-3 pl-10 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
      />
    </div>
  );
}