import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

/**
 * Componente para proteger rutas según permisos de rol
 */
export default function ProtectedRoute({ children, pagina, requiereAuth = true }) {
  const { canAccess, loading, getRol } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Verificar si el usuario puede acceder a esta página
  if (!canAccess(pagina)) {
    const rol = getRol();
    
    // Mensajes personalizados según el rol
    if (rol === 'invitado') {
      toast.error('Debes iniciar sesión para acceder a esta página');
      return <Navigate to="/" replace />;
    }

    // Mensajes específicos por página
    const mensajes = {
      administrativa: 'Solo los administradores pueden acceder a esta sección',
      reportesP: 'Solo los proveedores pueden acceder a esta sección',
      miperfil: 'Debes iniciar sesión para ver tu perfil',
      mispedidos: 'Debes iniciar sesión para ver tus pedidos',
    };

    toast.error(mensajes[pagina] || 'No tienes permisos para acceder a esta página');
    return <Navigate to="/" replace />;
  }

  // Si tiene permisos, renderizar el componente
  return children;
}