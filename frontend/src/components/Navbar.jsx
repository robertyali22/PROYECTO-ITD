// Navbar.jsx - Versión actualizada con categorías dinámicas
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
  ChevronRight,
} from "lucide-react";
import authService from "../services/authService";
import categoriaService from "../services/categoriaService";
import productoService from "../services/productoService";
import toast from "react-hot-toast";
import SearchBar from "./SearchBar";
import { useCart } from "../context/CartContext";

export default function Navbar({ onLoginClick, onRegisterClick }) {
  const [usuario, setUsuario] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showCategories, setShowCategories] = useState(false);

  // Estados para categorías dinámicas
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);

  const menuRef = useRef(null);
  const mobileRef = useRef(null);
  const catRef = useRef(null);
  const { cartCount } = useCart();

  useEffect(() => {
    const u = authService.getCurrentUser();
    setUsuario(u);
    cargarCategorias();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuAbierto(false);
      if (mobileRef.current && !mobileRef.current.contains(e.target))
        setMobileOpen(false);
      if (catRef.current && !catRef.current.contains(e.target))
        setShowCategories(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Cargar categorías y subcategorías desde la BD
  const cargarCategorias = async () => {
    try {
      setCargandoCategorias(true);
      const [categoriasData, subcategoriasData] = await Promise.all([
        categoriaService.obtenerCategorias(),
        categoriaService.obtenerSubcategorias(),
      ]);

      setCategorias(categoriasData);
      setSubcategorias(subcategoriasData);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      toast.error("Error al cargar categorías");
    } finally {
      setCargandoCategorias(false);
    }
  };

  // Agrupar subcategorías por categoría
  const obtenerSubcategoriasPorCategoria = (categoriaId) => {
    return subcategorias.filter((sub) => sub.categoriaId === categoriaId);
  };

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

  // Navegar al catálogo con filtro de categoría
  const handleCategoriaClick = (categoriaNombre) => {
    setShowCategories(false);
    setMobileOpen(false);
    window.location.href = `/catalogo?categoria=${encodeURIComponent(
      categoriaNombre
    )}`;
  };

  // Navegar al catálogo con filtro de categoría y subcategoría
  const handleSubcategoriaClick = (categoriaNombre, subcategoriaNombre) => {
    setShowCategories(false);
    setMobileOpen(false);
    window.location.href = `/catalogo?categoria=${encodeURIComponent(
      categoriaNombre
    )}&subcategoria=${encodeURIComponent(subcategoriaNombre)}`;
  };

  const onSearchSubmit = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    window.location.href = `/catalogo?search=${encodeURIComponent(query)}`;
  };

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200">
      <script
        src="//code.tidio.co/mbxpg2jgj7sxno5t5iijfxojgwmjrozs.js"
        async
      ></script>
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
            {/* Desktop Search */}
            <div className="hidden md:block">
              <SearchBar
                productoService={productoService}
                onNavigate={handleNavigate}
              />
            </div>

            {/* Mobile Search */}
            <div className="md:hidden">
              <SearchBar
                productoService={productoService}
                onNavigate={handleNavigate}
              />
            </div>
          </div>

          {/* Utilities right */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavigate("/carrito")}
              className="relative p-2 text-gray-700 hover:text-orange-700 transition"
              aria-label="Ver carrito"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {usuario ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuAbierto((s) => !s)}
                  className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
                >
                  <User size={18} />
                  <span className="hidden sm:inline text-sm font-medium">
                    {usuario.nombre}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`${
                      menuAbierto ? "rotate-180" : ""
                    } transition-transform`}
                  />
                </button>

                {menuAbierto && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">
                        {usuario.nombre} {usuario.apellido}
                      </p>
                      <p className="text-xs text-gray-500">{usuario.email}</p>
                      <p className="text-xs text-orange-600 font-medium mt-1">
                        {usuario.rol.toUpperCase()}
                      </p>
                    </div>

                    <button
                      onClick={() => handleNavigate("/miperfil")}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                    >
                      <UserCircle size={16} /> <span>Mi Perfil</span>
                    </button>

                    <button
                      onClick={() => handleNavigate("/mispedidos")}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                    >
                      <Package size={16} /> <span>Mis Pedidos</span>
                    </button>

                    {usuario?.rol === "administrador" && (
                      <button
                        onClick={() => handleNavigate("/Administrativa")}
                        className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                      >
                        <Package size={16} /> <span>Administrativa</span>
                      </button>
                    )}
                    {usuario?.rol === "proveedor" && (
                      <>
                        <button
                          onClick={() => handleNavigate("/proveedor/productos")}
                          className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                        >
                          <Package size={16} /> <span>Mis productos</span>
                        </button>
                        <button
                          onClick={() =>
                            handleNavigate("/proveedor/productos/nuevo")
                          }
                          className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                        >
                          <Package size={16} /> <span>Crear producto</span>
                        </button>
                      </>
                    )}

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleCerrarSesion}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut size={16} /> <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={onLoginClick}
                  className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={onRegisterClick}
                  className="px-3 py-2 border border-orange-600 text-orange-600 rounded-md hover:bg-orange-50 transition"
                >
                  Registrarse
                </button>
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
              {/* Categories menu - DINÁMICO */}
              <div className="relative" ref={catRef}>
                <button
                  onClick={() => setShowCategories((s) => !s)}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition"
                >
                  Categorías
                  <ChevronRight
                    size={16}
                    className={`${
                      showCategories ? "rotate-90" : ""
                    } transition-transform`}
                  />
                </button>

                {showCategories && (
                  <div className="absolute left-0 mt-2 w-[600px] bg-white rounded-lg shadow-xl border border-gray-200 py-4 z-50 max-h-[500px] overflow-y-auto">
                    {cargandoCategorias ? (
                      <div className="px-4 py-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-500">
                          Cargando categorías...
                        </p>
                      </div>
                    ) : categorias.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <p className="text-sm text-gray-500">
                          No hay categorías disponibles
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-6 px-4">
                        {categorias.map((categoria) => {
                          const subs = obtenerSubcategoriasPorCategoria(
                            categoria.id
                          );
                          return (
                            <div
                              key={categoria.id}
                              className="flex flex-col gap-2"
                            >
                              <button
                                onClick={() =>
                                  handleCategoriaClick(categoria.nombre)
                                }
                                className="font-semibold text-gray-800 hover:text-orange-600 transition text-left"
                              >
                                {categoria.nombre}
                              </button>
                              <ul className="text-sm text-gray-600">
                                {subs.length > 0 ? (
                                  subs.map((sub) => (
                                    <li key={sub.id}>
                                      <button
                                        onClick={() =>
                                          handleSubcategoriaClick(
                                            categoria.nombre,
                                            sub.nombre
                                          )
                                        }
                                        className="w-full py-1 hover:text-orange-600 cursor-pointer flex items-center justify-between text-left group"
                                      >
                                        <span>{sub.nombre}</span>
                                        <ChevronRight
                                          size={14}
                                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        />
                                      </button>
                                    </li>
                                  ))
                                ) : (
                                  <li className="py-1 text-gray-400 text-xs">
                                    Sin subcategorías
                                  </li>
                                )}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Primary links */}
              <nav className="hidden md:flex items-center gap-2 text-gray-700 font-medium ml-2">
                <a
                  href="/"
                  className="px-3 py-2 rounded-md hover:bg-orange-50 hover:text-orange-600 transition"
                >
                  Inicio
                </a>
                <a
                  href="/catalogo"
                  className="px-3 py-2 rounded-md hover:bg-orange-50 hover:text-orange-600 transition"
                >
                  Productos
                </a>
                <a
                  href="/ofertas"
                  className="px-3 py-2 rounded-md hover:bg-orange-50 hover:text-orange-600 transition"
                >
                  Ofertas
                </a>
                <a
                  href="/contacto"
                  className="px-3 py-2 rounded-md hover:bg-orange-50 hover:text-orange-600 transition"
                >
                  Contacto
                </a>
                <button
                  onClick={() => handleNavigate("/solicitar-proveedor")}
                  className="px-3 py-2 rounded-md hover:bg-orange-50 hover:text-orange-600 transition"
                >
                  Sé socio
                </button>
              </nav>
            </div>

            {/* placeholder right side of bottom bar (e.g., promos) */}
            <div className="text-sm text-gray-600 hidden md:block">
              Envíos a todo el país • Soporte 24/7
            </div>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-sm">
          <div className="px-4 pt-4 pb-6 space-y-3">
            <button
              onClick={() => handleNavigate("/catalogo")}
              className="block w-full text-left px-3 py-2 rounded-md hover:bg-orange-50 hover:text-orange-600"
            >
              Productos
            </button>
            <button
              onClick={() => handleNavigate("/ofertas")}
              className="block w-full text-left px-3 py-2 rounded-md hover:bg-orange-50 hover:text-orange-600"
            >
              Ofertas
            </button>
            <button
              onClick={() => handleNavigate("/contacto")}
              className="block w-full text-left px-3 py-2 rounded-md hover:bg-orange-50 hover:text-orange-600"
            >
              Contacto
            </button>
            <button
              onClick={() => handleNavigate("/solicitar-proveedor")}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-orange-50 hover:text-orange-600"
            >
              Sé socio
            </button>

            {/* Categorías móvil */}
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs font-semibold text-gray-500 mb-2 px-3">
                CATEGORÍAS
              </p>
              {cargandoCategorias ? (
                <div className="py-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mx-auto"></div>
                </div>
              ) : (
                categorias.map((categoria) => {
                  const subs = obtenerSubcategoriasPorCategoria(categoria.id);
                  return (
                    <div key={categoria.id} className="py-2">
                      <button
                        onClick={() => handleCategoriaClick(categoria.nombre)}
                        className="font-semibold text-gray-800 hover:text-orange-600 w-full text-left px-3"
                      >
                        {categoria.nombre}
                      </button>
                      {subs.length > 0 && (
                        <div className="text-sm text-gray-600 pl-6 mt-1 space-y-1">
                          {subs.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() =>
                                handleSubcategoriaClick(
                                  categoria.nombre,
                                  sub.nombre
                                )
                              }
                              className="block hover:text-orange-600 w-full text-left py-1"
                            >
                              • {sub.nombre}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-3 border-t border-gray-100">
              {usuario ? (
                <>
                  <button
                    onClick={() => handleNavigate("/miperfil")}
                    className="w-full text-left px-3 py-2 rounded-md"
                  >
                    Mi Perfil
                  </button>
                  <button
                    onClick={() => handleNavigate("/mispedidos")}
                    className="w-full text-left px-3 py-2 rounded-md"
                  >
                    Mis Pedidos
                  </button>
                  <button
                    onClick={handleCerrarSesion}
                    className="w-full text-left px-3 py-2 rounded-md text-red-600"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onLoginClick}
                    className="w-full text-left px-3 py-2 rounded-md bg-orange-600 text-white mb-2"
                  >
                    Iniciar sesión
                  </button>
                  <button
                    onClick={onRegisterClick}
                    className="w-full text-left px-3 py-2 rounded-md border border-orange-600 text-orange-600"
                  >
                    Registrarse
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
