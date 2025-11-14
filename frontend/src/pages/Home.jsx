// src/pages/Home.jsx
import React from "react";
import { ChevronUp } from "lucide-react";
import Hero from "../components/Hero";

export default function Home() {
  const handleProductoClick = () => {
    window.location.href = `/vista_producto`;
  };

  return (
    <main>
      <Hero />
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Productos destacados
        </h2>

        {/* Cards de productos (simples por ahora) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-8">

          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div
              key={i}
              onClick={() => handleProductoClick(i)}
              className="bg-white shadow-md rounded-xl p-6 hover:drop-shadow-sm transition cursor-pointer"
            >
              
              <img
                src={`https://source.unsplash.com/400x300/?eco,product,${i}`}
                alt="Producto"
                className="rounded-lg mb-4 w-full h-48 object-cover"
              />
              <p className="text-sm text-gray-500 mb-2">Categoría</p>
              <h3 className="text-xl font-semibold text-gray-800">
                Producto {i}
              </h3>
              <p className="text-sm text-gray-600 mt-1 mb-3">
                por Proveedor-{i}
              </p>
              <div className="mt-4 mb-3">
                <p className="text-lg font-bold text-orange-600 mb-2">
                  $99.99
                </p>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-400">★★★★★</span>
                <span className="text-sm text-gray-600">(99)</span>
              </div>
              <button className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
                Añadir al carrito
              </button>
            </div>
          ))}
        </div>
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
