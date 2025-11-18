// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import Hero from "../components/Hero";
import productoService from "../services/productoService";
import toast from "react-hot-toast";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const productosResponse = await productoService.obtenerProductosPublicos();
      const productosData = productosResponse.data || productosResponse;
      
      if (Array.isArray(productosData)) {
        // Filtrar productos por nombre específico
        const nombresEspecificos = [
          'tomate', 'brócoli', 'zanahoria', 'papa', 'piña', 'palta', 
          'plátano', 'detergente', 'sal', 'harina', 'leche', 'champú', 'arroz', 'atún'
        ];
        
        const productosFilurados = productosData.filter(p => 
          nombresEspecificos.some(nombre => p.nombre.toLowerCase().includes(nombre.toLowerCase()))
        );
        
        // Si hay productos filtrados, usarlos; si no, mezclar todos aleatoriamente
        const productosAUsar = productosFilurados.length > 0 
          ? productosFilurados 
          : [...productosData].sort(() => Math.random() - 0.5);
        
        // Mostrar máximo 15 productos
        setProductos(productosAUsar.slice(0, 15));
      } else {
        toast.error('Error al procesar los productos');
        console.error('Estructura inesperada:', productosResponse);
      }
    } catch (error) {
      toast.error('Error al cargar productos');
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const handleProductoClick = (productoId) => {
    window.location.href = `/vista_producto?id=${productoId}`;
  };

  const irAlCatalogo = () => {
    window.location.href = '/catalogo';
  };

  return (
    <main>
      <Hero />
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Productos destacados
        </h2>

        {cargando ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando productos...</p>
          </div>
        ) : productos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay productos disponibles</p>
          </div>
        ) : (
          <>
            {/* Grid de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
              {productos.map((producto) => (
                <div
                  key={producto.id}
                  onClick={() => handleProductoClick(producto.id)}
                  className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition cursor-pointer flex flex-col h-full"
                >
                  <img
                    src={producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes[0].urlImagen : 'https://via.placeholder.com/400x300?text=Sin+Imagen'}
                    alt={producto.nombre}
                    className="rounded-lg mb-3 w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
                    }}
                  />
                  <div className="flex flex-col flex-1 w-full">
                    <p className="text-xs text-gray-500 mb-2">
                      {producto.categoriaNombre || 'Categoría'}
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
                      {producto.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      por {producto.nombreEmpresa || 'Proveedor'}
                    </p>
                    <p className="text-xl font-bold text-orange-600 mb-2">
                      S/ {parseFloat(producto.precioUnitario).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-yellow-400 text-sm">
                        {"★".repeat(Math.floor(producto.calificacionPromedio || 3))}
                        {"☆".repeat(5 - Math.floor(producto.calificacionPromedio || 3))}
                      </span>
                      <span className="text-xs text-gray-600">
                        ({Math.floor(producto.calificacionPromedio || 0)})
                      </span>
                    </div>
                    <div className="flex-grow"></div>
                    <button className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm mt-auto">
                      Añadir al carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Botón Ver más */}
            <div className="text-center">
              <button
                onClick={irAlCatalogo}
                className="px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition text-lg"
              >
                Ver más productos
              </button>
            </div>
          </>
        )}
      </section>

      {/* Botón de scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 left-8 bg-orange-600 text-white p-3 rounded-full shadow-lg hover:bg-orange-700 transition-all duration-300 hover:scale-110 z-50"
        aria-label="Volver arriba"
      >
        <ChevronUp size={24} />
      </button>
    </main>
  );
}
