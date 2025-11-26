import React, { useState, useEffect } from "react";
import { ChevronLeft, Heart, ChevronUp, ShoppingCart } from "lucide-react";
import productoService from "../services/productoService";
import { useCart } from "../context/CartContext";
import authService from "../services/authService";
import toast from "react-hot-toast";

export default function VistaProducto() {
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [imagenActual, setImagenActual] = useState(0);
  const [tabActivo, setTabActivo] = useState("especificaciones");
  const [cantidad, setCantidad] = useState(1);
  const [agregando, setAgregando] = useState(false);

  // Hook del carrito
  const { addToCart } = useCart();

  useEffect(() => {
    cargarProducto();
  }, [window.location.search]);

  const cargarProducto = async () => {
    try {
      setCargando(true);
      // Obtener ID del producto de los parámetros de la URL
      const params = new URLSearchParams(window.location.search);
      const productoId = params.get("id");

      console.log("URL actual:", window.location.href);
      console.log("Producto ID buscado:", productoId);

      if (!productoId) {
        console.error("No hay ID de producto en la URL");
        toast.error("Producto no encontrado");
        setTimeout(() => {
          window.location.href = "/catalogo";
        }, 1000);
        return;
      }

      const productosResponse = await productoService.obtenerProductosPublicos();
      const productosData = productosResponse.data || productosResponse;

      console.log("Productos cargados:", productosData?.length);

      if (Array.isArray(productosData)) {
        const productoEncontrado = productosData.find(
          (p) => p.id === parseInt(productoId)
        );
        
        console.log("Producto encontrado:", productoEncontrado);

        if (productoEncontrado) {
          setProducto(productoEncontrado);
          // Establecer cantidad inicial como la mínima del producto
          setCantidad(productoEncontrado.cantidadMinima || 1);
        } else {
          console.error("Producto no encontrado con ID:", productoId);
          toast.error("Producto no encontrado");
          setTimeout(() => {
            window.location.href = "/catalogo";
          }, 1000);
        }
      } else {
        console.error("Los productos no son un array");
        toast.error("Error al cargar productos");
      }
    } catch (error) {
      console.error("Error en cargarProducto:", error);
      toast.error("Error al cargar el producto");
    } finally {
      setCargando(false);
    }
  };

  const irAtras = () => {
    window.history.back();
  };

  // Función para incrementar cantidad
  const handleIncrementar = () => {
    if (!producto) return;
    
    if (cantidad >= producto.stockDisponible) {
      toast.error(`Stock máximo disponible: ${producto.stockDisponible}`);
      return;
    }
    
    setCantidad(cantidad + 1);
  };

  // Función para decrementar cantidad
  const handleDecrementar = () => {
    if (!producto) return;
    
    const minima = producto.cantidadMinima || 1;
    
    if (cantidad <= minima) {
      toast.error(`Cantidad mínima de compra: ${minima}`);
      return;
    }
    
    setCantidad(cantidad - 1);
  };

  // Función para manejar cambio manual de cantidad
  const handleCambioCantidad = (e) => {
    if (!producto) return;
    
    const valor = parseInt(e.target.value) || 0;
    const minima = producto.cantidadMinima || 1;
    const maxima = producto.stockDisponible;
    
    if (valor < minima) {
      setCantidad(minima);
      toast.error(`Cantidad mínima de compra: ${minima}`);
    } else if (valor > maxima) {
      setCantidad(maxima);
      toast.error(`Stock máximo disponible: ${maxima}`);
    } else {
      setCantidad(valor);
    }
  };

  // Función principal para agregar al carrito
  const handleAgregarAlCarrito = async () => {
    try {
      // Verificar autenticación
      if (!authService.isAuthenticated()) {
        toast.error("Debes iniciar sesión para agregar productos al carrito");
        // Opcional: redirigir al login o mostrar modal
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
        return;
      }

      // Verificar que el producto esté disponible
      if (!producto.disponible) {
        toast.error("Este producto no está disponible");
        return;
      }

      // Validar cantidad mínima
      const minima = producto.cantidadMinima || 1;
      if (cantidad < minima) {
        toast.error(`La cantidad mínima de compra es ${minima}`);
        return;
      }

      // Validar stock
      if (cantidad > producto.stockDisponible) {
        toast.error(`Stock insuficiente. Disponible: ${producto.stockDisponible}`);
        return;
      }

      setAgregando(true);

      // Usar la función del context
      const success = await addToCart(producto.id, cantidad);

      if (success) {
        // Opcional: resetear cantidad a la mínima
        setCantidad(producto.cantidadMinima || 1);
      }

    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      toast.error(error.message || "Error al agregar al carrito");
    } finally {
      setAgregando(false);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Producto no encontrado</p>
          <button
            onClick={() => (window.location.href = "/catalogo")}
            className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  const imagenes = producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes : [];
  const imagenPrincipal =
    imagenes.length > 0
      ? imagenes[imagenActual]?.urlImagen
      : "https://via.placeholder.com/600x600?text=Sin+Imagen";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con botón atrás */}
      <div className="bg-white border-b border-gray-200 p-4 sticky">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={irAtras}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Volver atrás"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-800 flex-1">
            {producto.nombre}
          </h1>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Heart size={24} />
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sección de imágenes */}
          <div className="flex flex-col gap-4 items-center justify-center">
            {/* Imagen principal */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md w-full flex items-center justify-center mt-12">
              <img
                src={imagenPrincipal}
                alt={producto.nombre}
                className="w-full h-auto max-h-96 object-contain"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/600x600?text=Sin+Imagen";
                }}
              />
            </div>

            {/* Miniaturas */}
            {imagenes.length > 1 && (
              <div className="flex gap-3 overflow-x-auto w-full justify-center">
                {imagenes.map((imagen, index) => (
                  <button
                    key={index}
                    onClick={() => setImagenActual(index)}
                    className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      imagenActual === index
                        ? "border-orange-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={imagen.urlImagen}
                      alt={`${producto.nombre} ${index}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/100x100?text=No+imagen";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sección de información */}
          <div className="flex flex-col gap-6">
            {/* Categoría y rating */}
            <div>
              <p className="text-sm text-gray-500 mb-2">
                {producto.categoriaNombre || "Categoría"}
                {producto.subcategoriaNombre && ` • ${producto.subcategoriaNombre}`}
              </p>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {producto.nombre}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-lg">
                  {"★".repeat(Math.floor(producto.calificacionPromedio || 3))}
                  {"☆".repeat(5 - Math.floor(producto.calificacionPromedio || 3))}
                </span>
                <span className="text-gray-600">
                  ({Math.floor(producto.calificacionPromedio || 0)})
                </span>
              </div>
            </div>

            {/* Proveedor */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Proveedor</p>
              <p className="text-lg font-semibold text-gray-900">
                {producto.nombreEmpresa || "Proveedor"}
              </p>
            </div>

            {/* Precio y disponibilidad */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-sm text-orange-600 font-bold mb-1">
                Precio Online
              </p>
              <p className="text-4xl font-bold text-orange-600 mb-4">
                S/ {parseFloat(producto.precioUnitario).toFixed(2)}
              </p>

              <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 font-semibold">
                  ✓ Envío rápido disponible
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Disponibilidad</p>
                  <p className={`font-semibold ${
                    producto.disponible ? "text-green-600" : "text-red-600"
                  }`}>
                    {producto.disponible ? "En stock" : "No disponible"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Unidad de medida</p>
                  <p className="font-semibold">{producto.unidadMedida}</p>
                </div>
              </div>

              {/* Info de cantidad mínima y stock */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Cantidad mínima:</span>
                  <span className="font-semibold text-blue-900">
                    {producto.cantidadMinima} {producto.unidadMedida}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-blue-700">Stock disponible:</span>
                  <span className="font-semibold text-blue-900">
                    {producto.stockDisponible} {producto.unidadMedida}
                  </span>
                </div>
              </div>

              {/* Cantidad */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2 font-semibold">Cantidad</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDecrementar}
                    disabled={cantidad <= (producto.cantidadMinima || 1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={cantidad}
                    onChange={handleCambioCantidad}
                    min={producto.cantidadMinima || 1}
                    max={producto.stockDisponible}
                    className="w-20 text-center border border-gray-300 rounded-lg py-2 font-semibold"
                  />
                  <button
                    onClick={handleIncrementar}
                    disabled={cantidad >= producto.stockDisponible}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-600 ml-2">
                    {producto.unidadMedida}
                  </span>
                </div>
              </div>

              {/* Botón de compra */}
              <button
                onClick={handleAgregarAlCarrito}
                disabled={!producto.disponible || agregando}
                className="w-full py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {agregando ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Agregando...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    <span>
                      {producto.disponible 
                        ? `Agregar al Carrito (${cantidad})`
                        : "No disponible"
                      }
                    </span>
                  </>
                )}
              </button>

              {/* Subtotal */}
              {producto.disponible && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="text-xl font-bold text-gray-900">
                      S/ {(parseFloat(producto.precioUnitario) * cantidad).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs de información */}
        <div className="mt-12 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 flex">
            <button
              onClick={() => setTabActivo("especificaciones")}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                tabActivo === "especificaciones"
                  ? "border-b-2 border-orange-600 text-orange-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Especificaciones
            </button>
            <button
              onClick={() => setTabActivo("descripcion")}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                tabActivo === "descripcion"
                  ? "border-b-2 border-orange-600 text-orange-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Descripción
            </button>
          </div>

          <div className="p-6">
            {tabActivo === "especificaciones" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">
                      Tipo de Producto
                    </p>
                    <p className="text-gray-900">
                      {producto.categoriaNombre || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">
                      Unidad de Medida
                    </p>
                    <p className="text-gray-900">{producto.unidadMedida}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">
                      Cantidad Mínima
                    </p>
                    <p className="text-gray-900">{producto.cantidadMinima}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">
                      Stock Disponible
                    </p>
                    <p className="text-gray-900">{producto.stockDisponible}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {producto.descripcion || "No hay descripción disponible"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sección de Comentarios */}
        <div className="mt-12 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900">Comentarios</h2>
          </div>

          <div className="p-8">
            {/* Formulario para agregar comentario */}
            <div className="mb-10">
              <p className="text-sm text-gray-600 mb-4">Deja tu comentario</p>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-4 mb-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows="5"
                placeholder="Comparte tu opinión sobre este producto..."
                disabled
              ></textarea>
              <button
                className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg cursor-not-allowed"
                disabled
              >
                Publicar comentario
              </button>
            </div>

            {/* Lista de comentarios */}
            <div className="border-t border-gray-200 pt-10">
              <h3 className="font-semibold text-gray-900 mb-4">
                No hay comentarios aún
              </h3>
              <p className="text-gray-600">
                Sé el primero en comentar este producto cuando la funcionalidad esté disponible.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Botón de scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 left-8 bg-orange-600 text-white p-3 rounded-full shadow-lg hover:bg-orange-700 transition-all duration-300 hover:scale-110 z-50"
        aria-label="Volver arriba"
      >
        <ChevronUp size={24} />
      </button>
    </div>
  );
}
