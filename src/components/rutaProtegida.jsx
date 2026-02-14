import { Navigate } from 'react-router-dom';

// Este componente recibe a sus "hijos" (children), que en este caso será la página Admin
export function RutaProtegida({ children }) {
  const esAdmin = localStorage.getItem("esAdmin");

  // Si NO es admin, lo mandamos al Login
  if (!esAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Si SI es admin, dejamos que vea el contenido (los hijos)
  return children;
}