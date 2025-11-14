import { useState, useEffect, useRef } from "react";
import {
  User,
  ChevronDown,
  UserCircle,
  Package,
  LogOut,
  ShoppingCart,
  BarChart3,
  Shield,
} from "lucide-react";
import authService from "../services/authService";
import toast from "react-hot-toast";

export default function Navbar({ onLoginClick, onRegisterClick }) {
  const [usuario, setUsuario] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    // Cargar usuario al montar el componente
    const usuarioActual = authService.getCurrentUser();
    setUsuario(usuarioActual);
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAbierto(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCerrarSesion = () => {
    authService.logout();
    setUsuario(null);
    setMenuAbierto(false);
    toast.success("Sesión cerrada correctamente");
    window.location.href = "/";
  };

  const handleNavigate = (path) => {
    setMenuAbierto(false);
    window.location.href = path;
  };

  // Función para verificar si el usuario puede acceder a una ruta
  const canAccess = (pagina) => {
    const rol = usuario?.rol || 'invitado';
    
    const permisos = {
      miperfil: ['usuario', 'proveedor', 'administrador'],
      mispedidos: ['usuario', 'proveedor', 'administrador'],
      reportesP: ['proveedor'],
      administrativa: ['administrador'],
    };

    return permisos[pagina]?.includes(rol);
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => (window.location.href = "/")}
          aria-label="Ir a inicio"
          className="text-3xl font-bold text-orange-600 cursor-pointer hover:cursor-pointer"
        >
          Faraón
        </button>

        {/* Menú */}
        <ul className="flex items-center gap-8 text-gray-700 font-medium">
          <li className="hover:text-orange-600 cursor-pointer transition-colors">
            <a href="/" className="transition-colors hover:cursor-pointer">
              Inicio
            </a>
          </li>
          <li className="hover:text-orange-600 cursor-pointer transition-colors">
            <a
              href="/catalogo"
              className="transition-colors hover:cursor-pointer"
            >
              Productos
            </a>
          </li>
          <li className="hover:text-orange-600 cursor-pointer transition-colors hover:cursor-pointer">
            Ofertas
          </li>
          <li className="hover:text-orange-600 cursor-pointer transition-colors">
            <a
              href="/Contacto"
              className="transition-colors hover:cursor-pointer"
            >
              Contacto
            </a>
          </li>
        </ul>

        {/* Botones de autenticación o menú de usuario */}
        <div className="flex gap-3 items-center">
          {usuario ? (
            // Menú de usuario logueado
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuAbierto(!menuAbierto)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition hover:cursor-pointer"
              >
                <User size={20} />
                <span className="font-medium">
                  {usuario.nombre} {usuario.apellido}
                </span>
                <ChevronDown
                  size={18}
                  className={`transform transition-transform ${
                    menuAbierto ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Menú desplegable */}
              {menuAbierto && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">
                      {usuario.nombre} {usuario.apellido}
                    </p>
                    <p className="text-xs text-gray-500">{usuario.email}</p>
                    <p className="text-xs text-orange-600 font-medium mt-1">
                      {usuario.rol.toUpperCase()}
                    </p>
                  </div>

                  {/* Mi Perfil - Visible para usuario, proveedor, administrador */}
                  {canAccess('miperfil') && (
                    <button
                      onClick={() => handleNavigate("/miperfil")}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition hover:cursor-pointer"
                    >
                      <UserCircle size={18} />
                      <span>Mi Perfil</span>
                    </button>
                  )}

                  {/* Mis Pedidos - Visible para usuario, proveedor, administrador */}
                  {canAccess('mispedidos') && (
                    <button
                      onClick={() => handleNavigate("/mispedidos")}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition hover:cursor-pointer"
                    >
                      <Package size={18} />
                      <span>Mis Pedidos</span>
                    </button>
                  )}

                  {/* Panel Proveedor - Solo visible para proveedor */}
                  {canAccess('reportesP') && (
                    <button
                      onClick={() => handleNavigate("/reportesP")}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition hover:cursor-pointer"
                    >
                      <BarChart3 size={18} />
                      <span>Panel Proveedor</span>
                    </button>
                  )}

                  {/* Panel Administrativo - Solo visible para administrador */}
                  {canAccess('administrativa') && (
                    <button
                      onClick={() => handleNavigate("/Administrativa")}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition hover:cursor-pointer"
                    >
                      <Shield size={18} />
                      <span>Administración</span>
                    </button>
                  )}

                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={handleCerrarSesion}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition hover:cursor-pointer"
                    >
                      <LogOut size={18} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Botones de login y registro
            <>
              <button
                onClick={onLoginClick}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition hover:cursor-pointer"
              >
                Iniciar sesión
              </button>
              <button
                onClick={onRegisterClick}
                className="px-4 py-2 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition hover:cursor-pointer"
              >
                Registrarse
              </button>
            </>
          )}

          {/* Icono del carrito: siempre visible */}
          <button
            onClick={() => handleNavigate("/Carrito")}
            className="p-2 text-gray-700 hover:text-orange-700 transition hover:cursor-pointer"
            aria-label="Ver carrito"
          >
            <ShoppingCart size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}