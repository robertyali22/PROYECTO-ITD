import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Package, 
  Calendar, 
  MapPin, 
  Clock, 
  CreditCard, 
  ArrowLeft,
  Phone,
  ShoppingBag,
  Store
} from "lucide-react";
import pedidoService from "../services/pedidoService";
import toast from "react-hot-toast";

export default function DetallePedido() {
  const { pedidoId } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetallePedido();
  }, [pedidoId]);

  const fetchDetallePedido = async () => {
    try {
      setLoading(true);
      const response = await pedidoService.obtenerDetallePedido(pedidoId);
      
      if (response.success) {
        setPedido(response.data);
      } else {
        toast.error("Error al cargar el detalle del pedido");
        navigate("/mispedidos");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("No se pudo cargar el detalle del pedido");
      navigate("/mispedidos");
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    const estadoStr = String(estado).toLowerCase();
    switch (estadoStr) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmado":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "en_preparacion":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "enviado":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "entregado":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelado":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatEstado = (estado) => {
    return estado.replace(/_/g, ' ').toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Pedido no encontrado
          </h3>
          <Link
            to="/mispedidos"
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Volver a Mis Pedidos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Botón Volver */}
        <button
          onClick={() => navigate("/mispedidos")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Volver a Mis Pedidos</span>
        </button>

        {/* Encabezado del Pedido */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Pedido #{pedido.numeroPedido}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {new Date(pedido.fechaPedido).toLocaleDateString("es-PE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {new Date(pedido.fechaPedido).toLocaleTimeString("es-PE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${getEstadoColor(
                  pedido.estado
                )}`}
              >
                {formatEstado(pedido.estado)}
              </span>
              <p className="text-3xl font-bold text-gray-900">
                S/ {pedido.total.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Información de Entrega y Pago */}
          <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <MapPin size={18} className="text-orange-600" />
                Dirección de Entrega
              </h3>
              <p className="text-gray-600 ml-6">{pedido.direccionEntrega}</p>
              <div className="flex items-center gap-2 text-gray-600 ml-6">
                <Phone size={16} />
                <span>{pedido.telefonoContacto}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <CreditCard size={18} className="text-orange-600" />
                Método de Pago
              </h3>
              <p className="text-gray-600 ml-6">{pedido.metodoPago}</p>
            </div>
          </div>
        </div>

        {/* Productos del Pedido */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingBag size={24} className="text-orange-600" />
            Productos Comprados
          </h2>

          <div className="space-y-4">
            {pedido.productos.map((producto) => (
              <div
                key={producto.id}
                className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
              >
                {/* Imagen del Producto */}
                <div className="shrink-0">
                  {producto.imagenUrl ? (
                    <img
                      src={producto.imagenUrl}
                      alt={producto.nombreProducto}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package size={32} className="text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Información del Producto */}
                <div className="grow">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {producto.nombreProducto}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Store size={14} />
                    <span>{producto.nombreProveedor}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Cantidad: </span>
                      <span className="font-medium text-gray-900">
                        {producto.cantidad}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Precio unitario: </span>
                      <span className="font-medium text-gray-900">
                        S/ {producto.precioUnitario.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="shrink-0 text-right">
                  <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                  <p className="text-xl font-bold text-gray-900">
                    S/ {producto.subtotal.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen Total */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">
                Total del Pedido
              </span>
              <span className="text-2xl font-bold text-orange-600">
                S/ {pedido.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Botón de Acción */}
        <div className="mt-6 flex justify-center">
          <Link
            to="/catalogo"
            className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition font-medium"
          >
            Seguir Comprando
          </Link>
        </div>
      </div>
    </div>
  );
}