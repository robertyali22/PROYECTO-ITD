// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import {
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Truck,
  ShieldCheck,
  CreditCard,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// import Hero from "../components/Hero"; // Reemplazado por el carrusel integrado
import productoService from "../services/productoService";
import toast from "react-hot-toast";

export default function Home() {
  const navigate = useNavigate();

  // Estados para datos
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [productosNuevos, setProductosNuevos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estado para el Carrusel
  const [currentSlide, setCurrentSlide] = useState(0);

  // Datos simulados para el carrusel (Solo fondos de color por ahora)
  const slides = [
    {
      id: 1,
      color: "bg-orange-500",
      img: "https://lh3.googleusercontent.com/gg-dl/ABS2GSmYrf6VrqiaWYN3XtibSqt0VTi4b5aJDDX7lUcsvboxs_mCuMF9Be9nbTjBtVaT-EzC5xuOk1jjBFnuf_ZAWy5YRIzYWps0STkDXnvPTt-2cb7twcEfHhdxYfWuFl3ahw6KBS1BmiakjABJLyIqSI6Vnam24UHbeO9k9tlIxe8pUbOjHw=s1024-rj",
    }, // Puedes cambiar esto por <img src="" /> luego
    { id: 2, color: "bg-orange-400" },
    { id: 3, color: "bg-amber-500" },
  ];

  useEffect(() => {
    cargarProductos();
  }, []);

  // Autoplay del carrusel
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const productosResponse =
        await productoService.obtenerProductosPublicos();
      const productosData = productosResponse.data || productosResponse;

      if (Array.isArray(productosData)) {
        // --- LOGICA ORIGINAL DE FILTRADO (Productos Destacados) ---
        const nombresEspecificos = [
          "tomate",
          "brócoli",
          "zanahoria",
          "papa",
          "piña",
          "palta",
          "plátano",
          "detergente",
          "sal",
          "harina",
          "leche",
          "champú",
          "arroz",
          "atún",
        ];

        const productosFiltrados = productosData.filter((p) =>
          nombresEspecificos.some((nombre) =>
            p.nombre.toLowerCase().includes(nombre.toLowerCase())
          )
        );

        const destacados =
          productosFiltrados.length > 0
            ? productosFiltrados.slice(0, 10) // Limitamos a 10 para que no sea infinito
            : [...productosData].sort(() => Math.random() - 0.5).slice(0, 10);

        setProductosDestacados(destacados);

        // --- LOGICA PARA RECIÉN AGREGADOS ---
        // Tomamos los últimos del array original
        const nuevos = [...productosData].reverse().slice(0, 10);
        setProductosNuevos(nuevos);
      } else {
        toast.error("Error al procesar los productos");
      }
    } catch (error) {
      toast.error("Error al cargar productos");
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const handleProductoClick = (productoId) => {
    console.log("Click en producto:", productoId);
    navigate(`/vista_producto?id=${productoId}`);
  };

  const irAlCatalogo = () => {
    navigate("/catalogo");
  };

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  // Función para renderizar tu Card ORIGINAL (Para no repetir código en dos secciones)
  const renderCard = (producto) => (
    <div
      key={producto.id}
      onClick={() => handleProductoClick(producto.id)}
      className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition cursor-pointer flex flex-col h-full"
    >
      <img
        src={
          producto.imagenes && producto.imagenes.length > 0
            ? producto.imagenes[0].urlImagen
            : "https://via.placeholder.com/400x300?text=Sin+Imagen"
        }
        alt={producto.nombre}
        className="rounded-lg mb-3 w-full h-48 object-cover"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/400x300?text=Sin+Imagen";
        }}
      />
      <div className="flex flex-col flex-1 w-full">
        <p className="text-xs text-gray-500 mb-2">
          {producto.categoriaNombre || "Categoría"}
        </p>
        <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
          {producto.nombre}
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          por {producto.nombreEmpresa || "Proveedor"}
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
        <div className="grow"></div>
        <button className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm mt-auto">
          Añadir al carrito
        </button>
      </div>
    </div>
  );

  return (
    <main className="bg-gray-50 pb-16">
      {/* 1. HERO CARRUSEL FUNCIONAL */}
      <section className="relative w-full h-[350px] md:h-[500px] overflow-hidden group">
        <div
          className="w-full h-full flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`w-full h-full shrink-0 flex items-center justify-center ${slide.color}`}
            >
              {/* Aquí irá tu imagen de banner principal grande */}
              <p className="text-white text-2xl font-bold opacity-50">
                
              </p>
            </div>
          ))}
        </div>

        {/* Flechas */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition"
          >
            <ChevronLeft size={30} />
          </button>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition"
          >
            <ChevronRight size={30} />
          </button>
        </div>
      </section>

      {/* 2. SECCIÓN DE BENEFICIOS (Barra informativa) */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
            <Truck className="text-orange-600" size={32} />
            <div>
              <h4 className="font-bold text-gray-800">Envío Gratis</h4>
              <p className="text-sm text-gray-600">
                En pedidos mayores a S/100
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
            <ShieldCheck className="text-orange-600" size={32} />
            <div>
              <h4 className="font-bold text-gray-800">Compra Segura</h4>
              <p className="text-sm text-gray-600">Protección de datos 100%</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
            <CreditCard className="text-orange-600" size={32} />
            <div>
              <h4 className="font-bold text-gray-800">Pago Flexible</h4>
              <p className="text-sm text-gray-600">Tarjetas y Yape/Plin</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
            <Clock className="text-orange-600" size={32} />
            <div>
              <h4 className="font-bold text-gray-800">Soporte 24/7</h4>
              <p className="text-sm text-gray-600">Atención personalizada</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRODUCTOS DESTACADOS */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-orange-600 pl-4">
          Productos Destacados
        </h2>

        {cargando ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando productos...</p>
          </div>
        ) : productosDestacados.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No hay productos destacados disponibles
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
            {productosDestacados.map((producto) => renderCard(producto))}
          </div>
        )}
      </section>

      {/* 3. SECCIÓN 3 BANNERS (ESPACIO PARA IMAGENES) */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Banner 1 */}
          <div className="h-56 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer bg-gray-200">
            
          </div>
          {/* Banner 2 */}
          <div className="h-56 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer bg-gray-200">
            
          </div>
          {/* Banner 3 */}
          <div className="h-56 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer bg-gray-200">
            
          </div>
        </div>
      </section>

      {/* 5. SECCIÓN RECIÉN AGREGADOS */}
      <section className="max-w-7xl mx-auto px-6 py-8 rounded-3xl my-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 border-l-4 border-orange-600 pl-4">
            Recién Agregados
          </h2>
          <button
            onClick={irAlCatalogo}
            className="text-orange-600 font-semibold hover:underline"
          >
            Ver todos
          </button>
        </div>

        {cargando ? (
          <p className="text-center text-gray-500">Actualizando catálogo...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
            {productosNuevos.map((producto) => renderCard(producto))}
          </div>
        )}
      </section>

      {/* Botón Scroll Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 left-8 bg-orange-600 text-white p-3 rounded-full shadow-lg hover:bg-orange-700 transition-all duration-300 hover:scale-110 z-50"
        aria-label="Volver arriba"
      >
        <ChevronUp size={24} />
      </button>
    </main>
  );
}
