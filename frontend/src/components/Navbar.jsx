import { useState, useEffect, useRef } from "react";
import {
  User,
  ChevronDown,
  UserCircle,
  Package,
  LogOut,
  ShoppingCart,
  Menu,
  X,
  Search as SearchIcon,
  ChevronRight,
} from "lucide-react";
import authService from "../services/authService";
import toast from "react-hot-toast";

export default function Navbar({ onLoginClick, onRegisterClick }) {
  const [usuario, setUsuario] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const menuRef = useRef(null);
  const mobileRef = useRef(null);
  const catRef = useRef(null);

  const categoriasMock = [
    {
      id: 1,
      nombre: "Tecnología",
      sub: ["Teléfonos", "Computadoras", "Accesorios"],
    },
    { id: 2, nombre: "Electrohogar", sub: ["Cocina", "Limpieza", "Pequeños"] },
    { id: 3, nombre: "Muebles y Organización", sub: ["Sala", "Dormitorio", "Oficina"] },
    { id: 4, nombre: "Deportes", sub: ["Fitness", "Outdoor", "Ropa Deportiva"] },
    { id: 5, nombre: "Niños y Juguetes", sub: ["Bebés", "Juguetes", "Ropa Infantil"] },
  ];

  useEffect(() => {
    const u = authService.getCurrentUser();
    setUsuario(u);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuAbierto(false);
      if (mobileRef.current && !mobileRef.current.contains(e.target)) setMobileOpen(false);
      if (catRef.current && !catRef.current.contains(e.target)) setShowCategories(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCerrarSesion = () => {
    authService.logout();
    setUsuario(null);
    setMenuAbierto(false);
    toast.success("Sesión cerrada");
    window.location.href = "/";
  };

  const handleNavigate = (path) => {
    setMenuAbierto(false);
    setMobileOpen(false);
    setShowCategories(false);
    window.location.href = path;
  };

  const onSearchSubmit = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    window.location.href = `/catalogo?search=${encodeURIComponent(query)}`;
  };

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200">
      {/* TOP: logo (izq) - buscador (centro) - usuario/carrito (derecha) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo left */}
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => handleNavigate("/")}
              aria-label="Ir a inicio"
              className="text-2xl font-extrabold text-orange-600 hover:opacity-90"
            >
              Faraón
            </button>
          </div>

          {/* Search center */}
          <div className="flex-1 mx-6">
            <form onSubmit={onSearchSubmit} className="hidden md:flex items-center gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar productos, marcas, categorías..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  aria-label="Buscar productos"
                />
              </div>
              <button type="submit" className="px-4 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition">
                Buscar
              </button>
            </form>

            {/* Mobile small search visible on small screens */}
            <div className="md:hidden">
              <form onSubmit={onSearchSubmit} className="flex items-center gap-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none"
                />
                <button type="submit" className="px-3 py-2 bg-orange-600 text-white rounded-md">OK</button>
              </form>
            </div>
          </div>

          {/* Utilities right */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavigate("/carrito")}
              className="p-2 text-gray-700 hover:text-orange-700 transition"
              aria-label="Ver carrito"
            >
              <ShoppingCart size={20} />
            </button>

            {usuario ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuAbierto((s) => !s)}
                  className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
                >
                  <User size={18} />
                  <span className="hidden sm:inline text-sm font-medium">{usuario.nombre}</span>
                  <ChevronDown size={16} className={`${menuAbierto ? "rotate-180" : ""} transition-transform`} />
                </button>

                {menuAbierto && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{usuario.nombre} {usuario.apellido}</p>
                      <p className="text-xs text-gray-500">{usuario.email}</p>
                    </div>

                    <button onClick={() => handleNavigate("/miperfil")} className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition">
                      <UserCircle size={16} /> <span>Mi Perfil</span>
                    </button>

                    <button onClick={() => handleNavigate("/mispedidos")} className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition">
                      <Package size={16} /> <span>Mis Pedidos</span>
                    </button>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button onClick={handleCerrarSesion} className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition">
                        <LogOut size={16} /> <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <button onClick={onLoginClick} className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition">Iniciar sesión</button>
                <button onClick={onRegisterClick} className="px-3 py-2 border border-orange-600 text-orange-600 rounded-md hover:bg-orange-50 transition">Registrarse</button>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((s) => !s)}
              className="p-2 text-gray-700 hover:text-orange-700 transition md:hidden"
              aria-label="Abrir menú"
              ref={mobileRef}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM: categorias + nav links */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              {/* Categories visual menu */}
              <div className="relative" ref={catRef}>
                <button
                  onClick={() => setShowCategories((s) => !s)}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition"
                >
                  Categorías
                  <ChevronRight size={16} className={`${showCategories ? "rotate-90" : ""} transition-transform`} />
                </button>

                {showCategories && (
                  <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-4 z-50">
                    <div className="grid grid-cols-2 gap-4 px-4">
                      {categoriasMock.map((c) => (
                        <div key={c.id} className="flex flex-col gap-2">
                          <div className="font-semibold text-gray-800">{c.nombre}</div>
                          <ul className="text-sm text-gray-600">
                            {c.sub.map((s) => (
                              <li key={s} className="py-1 hover:text-orange-600 cursor-default flex items-center justify-between">
                                <span>{s}</span>
                                <ChevronRight size={14} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 mt-3 text-sm text-gray-500">Este menú es solo visual por ahora.</div>
                  </div>
                )}
              </div>

              {/* Primary links */}
              <nav className="hidden md:flex items-center gap-2 text-gray-700 font-medium ml-2">
                <a href="/" className="px-3 py-2 rounded-md hover:bg-orange-50 hover:text-orange-600 transition">Inicio</a>
                <a href="/catalogo" className="px-3 py-2 rounded-md hover:bg-orange-50 hover:text-orange-600 transition">Productos</a>
                <a href="/ofertas" className="px-3 py-2 rounded-md hover:bg-orange-50 hover:text-orange-600 transition">Ofertas</a>
                <a href="/contacto" className="px-3 py-2 rounded-md hover:bg-orange-50 hover:text-orange-600 transition">Contacto</a>
                <button onClick={() => handleNavigate("/SolicitudProveedor")} className="px-3 py-2 rounded-md hover:bg-orange-50 hover:text-orange-600 transition">Sé socio</button>
              </nav>
            </div>

            {/* placeholder right side of bottom bar (e.g., promos) */}
            <div className="text-sm text-gray-600 hidden md:block">Envíos a todo el país • Soporte 24/7</div>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-sm">
          <div className="px-4 pt-4 pb-6 space-y-3">
            <form onSubmit={onSearchSubmit} className="flex items-center gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none"
              />
              <button type="submit" className="px-3 py-2 bg-orange-600 text-white rounded-md">Buscar</button>
            </form>

            <button onClick={() => handleNavigate("/catalogo")} className="block px-3 py-2 rounded-md hover:bg-orange-50 hover:text-orange-600 text-left">Productos</button>
            <button onClick={() => handleNavigate("/ofertas")} className="block px-3 py-2 rounded-md hover:bg-orange-50 hover:text-orange-600 text-left">Ofertas</button>
            <button onClick={() => handleNavigate("/contacto")} className="block px-3 py-2 rounded-md hover:bg-orange-50 hover:text-orange-600 text-left">Contacto</button>
            <button onClick={() => handleNavigate("/SolicitudProveedor")} className="w-full text-left px-3 py-2 rounded-md hover:bg-orange-50 hover:text-orange-600">Sé socio</button>

            <div className="border-t border-gray-100 pt-3">
              {categoriasMock.map((c) => (
                <div key={c.id} className="py-2">
                  <div className="font-semibold text-gray-800">{c.nombre}</div>
                  <div className="text-sm text-gray-600 pl-3">
                    {c.sub.join(" • ")}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3">
              {usuario ? (
                <>
                  <button onClick={() => handleNavigate("/miperfil")} className="w-full text-left px-3 py-2 rounded-md">Mi Perfil</button>
                  <button onClick={() => handleNavigate("/mispedidos")} className="w-full text-left px-3 py-2 rounded-md">Mis Pedidos</button>
                  <button onClick={handleCerrarSesion} className="w-full text-left px-3 py-2 rounded-md text-red-600">Cerrar Sesión</button>
                </>
              ) : (
                <>
                  <button onClick={onLoginClick} className="w-full text-left px-3 py-2 rounded-md bg-orange-600 text-white">Iniciar sesión</button>
                  <button onClick={onRegisterClick} className="w-full text-left px-3 py-2 rounded-md border border-orange-600 text-orange-600">Registrarse</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}