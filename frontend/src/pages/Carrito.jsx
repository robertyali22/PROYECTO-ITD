import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Para redirigir
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  AlertCircle,
  Package,
  ArrowRight,
} from "lucide-react";
import cartService from "../services/cartService";
import authService from "../services/authService";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function Carrito() {
  const [carrito, setCarrito] = useState(null);
  const [loading, setLoading] = useState(true);
  const { refreshCount } = useCart();
  const navigate = useNavigate();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [datosEntrega, setDatosEntrega] = useState({
      direccionEntrega: "",
      telefonoContacto: "",
      metodoPago: "TARJETA"
  });

  useEffect(() => {
    cargarCarrito();
  }, []);

  const cargarCarrito = async () => {
    try {
      setLoading(true);

      if (!authService.isAuthenticated()) {
        window.location.href = "/";
        return;
      }

      const response = await cartService.obtenerCarrito();
      setCarrito(response.data);
    } catch (error) {
      console.error("Error al cargar carrito:", error);
      toast.error("Error al cargar el carrito");
    } finally {
      setLoading(false);
    }
  };

  const handleActualizarCantidad = async (carritoId, nuevaCantidad) => {
    try {
      await cartService.actualizarCantidad(carritoId, nuevaCantidad);
      await cargarCarrito();
      toast.success("Cantidad actualizada");
    } catch (error) {
      toast.error(error.message || "Error al actualizar cantidad");
    }
  };

  const handleEliminar = async (carritoId) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      await cartService.eliminarProducto(carritoId);
      await cargarCarrito();
      await refreshCount();
      toast.success("Producto eliminado");
    } catch (error) {
      toast.error(error.message || "Error al eliminar producto");
    }
  };

  const handleVaciarCarrito = async () => {
    if (!confirm("¿Estás seguro de vaciar todo el carrito?")) return;

    try {
      await cartService.vaciarCarrito();
      await cargarCarrito();
      await refreshCount();
      toast.success("Carrito vaciado");
    } catch (error) {
      toast.error(error.message || "Error al vaciar carrito");
    }
  };

  const handleCheckout = async (e) => {
      e.preventDefault();

      if(!datosEntrega.direccionEntrega || !datosEntrega.telefonoContacto){
          toast.error("Por favor completa todos los campos");
          return;
      }

      try {
          setLoading(true); // Reutilizamos tu estado loading
          await cartService.realizarPedido(datosEntrega);

          toast.success("¡Pedido realizado con éxito!");
          await refreshCount(); // Actualizar contador del navbar

          // Redirigir a "Mis Pedidos"
          navigate("/mispedidos"); 

      } catch (error) {
          toast.error(error.message || "Error al procesar la compra");
          setLoading(false); // Solo quitamos loading si falla, si es éxito navegamos
      }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  if (!carrito || carrito.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart size={64} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-600 mb-6">
            ¡Agrega productos para comenzar a comprar!
          </p>
          <a
            href="/catalogo"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            Ver productos
            <ArrowRight size={20} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mi Carrito</h1>
          <button
            onClick={handleVaciarCarrito}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <Trash2 size={18} />
            Vaciar carrito
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items del carrito */}
          <div className="lg:col-span-2 space-y-4">
            {carrito.items.map((item) => (
              <CarritoItem
                key={item.id}
                item={item}
                onActualizar={handleActualizarCantidad}
                onEliminar={handleEliminar}
              />
            ))}
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Resumen del pedido
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Productos ({carrito.cantidadTotal})</span>
                  <span>{carrito.cantidadProductos} unidades</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Proveedores</span>
                  <span>{carrito.totalProveedores}</span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Subtotal</span>
                    <span>S/ {carrito.subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button 
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition font-semibold"
              >
                  Proceder al pago
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Los costos de envío se calcularán en el siguiente paso
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de Checkout */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
     
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCheckoutOpen(false)}
          ></div>

          <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-md w-full z-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
              Finalizar Compra
            </h2>
            
            <form onSubmit={handleCheckout} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Dirección de Entrega
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                  placeholder="Ej: Av. Principal 123, Lima"
                  value={datosEntrega.direccionEntrega}
                  onChange={(e) =>
                    setDatosEntrega({
                      ...datosEntrega,
                      direccionEntrega: e.target.value,
                    })
                  }
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Teléfono de Contacto
                </label>
                <input
                  type="tel"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                  placeholder="Ej: 999 999 999"
                  value={datosEntrega.telefonoContacto}
                  onChange={(e) =>
                    setDatosEntrega({
                      ...datosEntrega,
                      telefonoContacto: e.target.value,
                    })
                  }
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Método de Pago
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white transition"
                  value={datosEntrega.metodoPago}
                  onChange={(e) =>
                    setDatosEntrega({
                      ...datosEntrega,
                      metodoPago: e.target.value,
                    })
                  }
                >
                  <option value="TARJETA">Tarjeta de Crédito/Débito</option>
                  <option value="YAPE">Yape / Plin</option>
                  <option value="EFECTIVO">Pago contraentrega</option>
                </select>
              </div>

              <div className="flex gap-3 mt-8 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium shadow-md transition"
                >
                  Confirmar Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para cada item del carrito
function CarritoItem({ item, onActualizar, onEliminar }) {
  const [cantidad, setCantidad] = useState(item.cantidad);
  const [actualizando, setActualizando] = useState(false);

  const handleIncrement = async () => {
    if (cantidad >= item.stockDisponible) {
      toast.error("Stock máximo alcanzado");
      return;
    }

    const nuevaCantidad = cantidad + 1;
    setActualizando(true);
    setCantidad(nuevaCantidad);

    try {
      await onActualizar(item.id, nuevaCantidad);
    } catch (error) {
      setCantidad(cantidad);
    } finally {
      setActualizando(false);
    }
  };

  const handleDecrement = async () => {
    if (cantidad <= item.cantidadMinima) {
      toast.error(`Cantidad mínima: ${item.cantidadMinima}`);
      return;
    }

    const nuevaCantidad = cantidad - 1;
    setActualizando(true);
    setCantidad(nuevaCantidad);

    try {
      await onActualizar(item.id, nuevaCantidad);
    } catch (error) {
      setCantidad(cantidad);
    } finally {
      setActualizando(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex gap-4">
      {/* Imagen */}
      <div className="shrink-0">
        <img
          src={item.imagenUrl || "/placeholder.png"}
          alt={item.nombreProducto}
          className="w-24 h-24 object-cover rounded-lg"
        />
      </div>

      {/* Info */}
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-gray-900">
              {item.nombreProducto}
            </h3>
            <p className="text-sm text-gray-500">{item.nombreEmpresa}</p>
          </div>
          <button
            onClick={() => onEliminar(item.id)}
            className="text-red-600 hover:text-red-700 transition"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          {/* Cantidad */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrement}
              disabled={actualizando || cantidad <= item.cantidadMinima}
              className="p-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Minus size={16} />
            </button>

            <span className="w-12 text-center font-semibold">{cantidad}</span>

            <button
              onClick={handleIncrement}
              disabled={actualizando || cantidad >= item.stockDisponible}
              className="p-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Plus size={16} />
            </button>

            <span className="text-xs text-gray-500 ml-2">
              {item.unidadMedida}
            </span>
          </div>

          {/* Precio */}
          <div className="text-right">
            <p className="text-sm text-gray-500">
              S/ {item.precioUnitario.toFixed(2)} c/u
            </p>
            <p className="text-lg font-bold text-orange-600">
              S/ {item.subtotal.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Stock disponible */}
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
          <Package size={12} />
          <span>Stock: {item.stockDisponible}</span>
          <span>•</span>
          <span>Mínimo: {item.cantidadMinima}</span>
        </div>

        {!item.disponible && (
          <div className="mt-2 flex items-center gap-2 text-xs text-red-600">
            <AlertCircle size={12} />
            <span>Producto no disponible</span>
          </div>
        )}
      </div>
    </div>
  );
}
