import { useState, useEffect } from 'react';
import authService from '../services/authService';

/**
 * Hook personalizado para manejar autenticación y autorización
 */
export const useAuth = () => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuarioActual = authService.getCurrentUser();
    setUsuario(usuarioActual);
    setLoading(false);
  }, []);

  /**
   * Verifica si el usuario está autenticado
   */
  const isAuthenticated = () => {
    return authService.isAuthenticated();
  };

  /**
   * Obtiene el rol del usuario actual
   */
  const getRol = () => {
    return usuario?.rol || 'invitado';
  };

  /**
   * Verifica si el usuario tiene un rol específico
   */
  const hasRole = (rol) => {
    const rolActual = getRol();
    return rolActual === rol;
  };

  /**
   * Verifica si el usuario tiene alguno de los roles permitidos
   */
  const hasAnyRole = (roles) => {
    const rolActual = getRol();
    return roles.includes(rolActual);
  };

  /**
   * Verifica permisos para acceder a páginas específicas
   */
  const canAccess = (pagina) => {
    const rol = getRol();

    // Definición de permisos por página
    const permisos = {
      // Páginas públicas (todos pueden acceder)
      home: ['invitado', 'usuario', 'proveedor', 'administrador'],
      catalogo: ['invitado', 'usuario', 'proveedor', 'administrador'],
      contacto: ['invitado', 'usuario', 'proveedor', 'administrador'],
      carrito: ['invitado', 'usuario', 'proveedor', 'administrador'],
      
      // Páginas que requieren login
      miperfil: ['usuario', 'proveedor', 'administrador'],
      mispedidos: ['usuario', 'proveedor', 'administrador'],
      
      // Página exclusiva de proveedor
      reportesP: ['proveedor'],
      
      // Página exclusiva de administrador
      administrativa: ['administrador'],
    };

    return permisos[pagina]?.includes(rol) || false;
  };

  return {
    usuario,
    loading,
    isAuthenticated,
    getRol,
    hasRole,
    hasAnyRole,
    canAccess,
  };
};