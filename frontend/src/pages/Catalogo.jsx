import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export default function Catalogo() {
  const [productos, setProductos] = useState(
    Array.from({ length: 45 }, (_, i) => ({
      id: i + 1,
      nombre: `Producto ${i + 1}`,
      categoria: ["Electrónica", "Hogar", "Ropa", "Deportes", "Libros"][i % 5],
      subcategoria: [
        "Teléfonos", "Decoración", "Computadoras", "Camisetas", "Muebles",
        "Accesorios", "Electrodomésticos", "Zapatos", "Ropa Deportiva", "Novelas"
      ][i % 10],
      precio: Math.floor(Math.random() * 1000) + 10,
      imagen: `https://source.unsplash.com/400x300/?eco,product,${i + 1}`,
      proveedor: `Proveedor-${(i % 5) + 1}`,
      rating: (Math.random() * 2 + 3).toFixed(1),
      reviews: Math.floor(Math.random() * 200) + 10,
      popular: Math.random() > 0.5,
      masComprado: Math.random() > 0.5,
    }))
  );

  const [productosFiltrados, setProductosFiltrados] = useState(productos);
  const [filtroPrecio, setFiltroPrecio] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroSubcategoria, setFiltroSubcategoria] = useState("");
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registroModalOpen, setRegistroModalOpen] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 15;

  useEffect(() => {
    aplicarFiltros();
    setPaginaActual(1); // Reset to first page when filters change
  }, [filtroPrecio, filtroCategoria, filtroSubcategoria]);

  const aplicarFiltros = () => {
    let filtrados = [...productos];

    if (filtroPrecio === "mayor-menor") {
      filtrados.sort((a, b) => b.precio - a.precio);
    } else if (filtroPrecio === "menor-mayor") {
      filtrados.sort((a, b) => a.precio - b.precio);
    } else if (filtroPrecio === "populares") {
      filtrados = filtrados.filter((p) => p.popular);
    } else if (filtroPrecio === "mas-comprados") {
      filtrados = filtrados.filter((p) => p.masComprado);
    }

    if (filtroCategoria) {
      filtrados = filtrados.filter((p) => p.categoria === filtroCategoria);
    }

    if (filtroSubcategoria) {
      filtrados = filtrados.filter((p) => p.subcategoria === filtroSubcategoria);
    }

    setProductosFiltrados(filtrados);
  };

  const categorias = [...new Set(productos.map((p) => p.categoria))];
  const subcategorias = [...new Set(productos.map((p) => p.subcategoria))];

  // Paginación
  const indiceUltimoProducto = paginaActual * productosPorPagina;
  const indicePrimerProducto = indiceUltimoProducto - productosPorPagina;
  const productosActuales = productosFiltrados.slice(indicePrimerProducto, indiceUltimoProducto);
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  const handleProductoClick = (productoId) => {
    window.location.href = `/vista_producto`;
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-left">
          Catálogo de Productos
        </h1>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filtroPrecio}
              onChange={(e) => setFiltroPrecio(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Ordenar por...</option>
              <option value="mayor-menor">Precio: Mayor a Menor</option>
              <option value="menor-mayor">Precio: Menor a Mayor</option>
              <option value="populares">Populares</option>
              <option value="mas-comprados">Más Comprados</option>
            </select>

            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Todas las Categorías</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={filtroSubcategoria}
              onChange={(e) => setFiltroSubcategoria(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Todas las Subcategorías</option>
              {subcategorias.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setFiltroPrecio("");
                setFiltroCategoria("");
                setFiltroSubcategoria("");
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-8">
          {productosActuales.map((producto) => (
            <div
              key={producto.id}
              onClick={() => handleProductoClick(producto.id)}
              className="bg-white shadow-md rounded-xl p-6 hover:drop-shadow-sm transition cursor-pointer"
            >
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="rounded-lg mb-4 w-full h-48 object-cover"
              />
              <p className="text-sm text-gray-500 mb-2">
                {producto.categoria} - {producto.subcategoria}
              </p>
              <h3 className="text-xl font-semibold text-gray-800">
                {producto.nombre}
              </h3>
              <p className="text-sm text-gray-600 mt-1 mb-3">
                por {producto.proveedor}
              </p>
              <div className="mt-4 mb-3">
                <p className="text-lg font-bold text-orange-600 mb-2">
                  ${producto.precio}
                </p>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-400">
                  {"★".repeat(Math.floor(producto.rating))}
                  {"☆".repeat(5 - Math.floor(producto.rating))}
                </span>
                <span className="text-sm text-gray-600">
                  ({producto.reviews})
                </span>
              </div>
              <button className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
                Añadir al carrito
              </button>
            </div>
          ))}
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="flex justify-center mt-12 mb-8">
            <div className="flex gap-2">
              <button
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Anterior
              </button>

              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
                <button
                  key={numero}
                  onClick={() => cambiarPagina(numero)}
                  className={`px-4 py-2 rounded-lg transition ${
                    paginaActual === numero
                      ? "bg-orange-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {numero}
                </button>
              ))}

              <button
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Botón de scroll to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 left-8 bg-orange-600 text-white p-3 rounded-full shadow-lg hover:bg-orange-700 transition-all duration-300 hover:scale-110 z-50"
          aria-label="Volver arriba"
        >
          <ChevronUp size={24} />
        </button>
      </main>

    </div>
  );
}
