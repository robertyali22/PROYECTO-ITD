import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  CreditCard,
  Smartphone,
  Wallet,
  MapPin,
  Phone,
  User,
  ArrowLeft,
  CheckCircle,
  Package,
} from "lucide-react";
import cartService from "../services/cartService";
import toast from "react-hot-toast";

export default function Checkout() {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState(null);
  const [loading, setLoading] = useState(true);
  const [procesandoPago, setProcesandoPago] = useState(false);

  // Datos de entrega (se guardan en BD)
  const [datosEntrega, setDatosEntrega] = useState({
    direccionEntrega: "",
    telefonoContacto: "",
    metodoPago: "", // TARJETA, YAPE, EFECTIVO
  });

  // Datos de tarjeta (solo frontend, no se guardan)
  const [datosTarjeta, setDatosTarjeta] = useState({
    numeroTarjeta: "",
    nombreTitular: "",
    fechaVencimiento: "",
    cvv: "",
  });

  // Estado para controlar si el pago con Yape fue completado
  const [pagoYapeCompletado, setPagoYapeCompletado] = useState(false);

  useEffect(() => {
    cargarCarrito();
  }, []);

  const cargarCarrito = async () => {
    try {
      setLoading(true);
      const response = await cartService.obtenerCarrito();
      
      if (!response.data || response.data.items.length === 0) {
        toast.error("Tu carrito está vacío");
        navigate("/carrito");
        return;
      }
      
      setCarrito(response.data);
    } catch (error) {
      console.error("Error al cargar carrito:", error);
      toast.error("Error al cargar el carrito");
      navigate("/carrito");
    } finally {
      setLoading(false);
    }
  };

  const validarDatosEntrega = () => {
    if (!datosEntrega.direccionEntrega.trim()) {
      toast.error("Ingresa tu dirección de entrega");
      return false;
    }
    if (!datosEntrega.telefonoContacto.trim()) {
      toast.error("Ingresa tu teléfono de contacto");
      return false;
    }
    if (!datosEntrega.metodoPago) {
      toast.error("Selecciona un método de pago");
      return false;
    }
    return true;
  };

  const validarDatosTarjeta = () => {
    if (!datosTarjeta.numeroTarjeta.trim()) {
      toast.error("Ingresa el número de tarjeta");
      return false;
    }
    if (datosTarjeta.numeroTarjeta.replace(/\s/g, "").length !== 16) {
      toast.error("El número de tarjeta debe tener 16 dígitos");
      return false;
    }
    if (!datosTarjeta.nombreTitular.trim()) {
      toast.error("Ingresa el nombre del titular");
      return false;
    }
    if (!datosTarjeta.fechaVencimiento.trim()) {
      toast.error("Ingresa la fecha de vencimiento");
      return false;
    }
    if (!datosTarjeta.cvv.trim() || datosTarjeta.cvv.length !== 3) {
      toast.error("El CVV debe tener 3 dígitos");
      return false;
    }
    return true;
  };

  const handleFinalizarCompra = async () => {
    // Validar datos de entrega
    if (!validarDatosEntrega()) return;

    // Validar según método de pago
    if (datosEntrega.metodoPago === "TARJETA") {
      if (!validarDatosTarjeta()) return;
      toast.success("Procesando pago con tarjeta...");
    } else if (datosEntrega.metodoPago === "YAPE") {
      if (!pagoYapeCompletado) {
        toast.error("Por favor confirma que realizaste el pago con Yape");
        return;
      }
      toast.success("Verificando pago Yape...");
    } else if (datosEntrega.metodoPago === "EFECTIVO") {
      toast.success("Procesando pedido...");
    }

    try {
      setProcesandoPago(true);

      // Simular delay de procesamiento (solo para UX)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Enviar solo los datos que se guardan en BD
      await cartService.realizarPedido({
        direccionEntrega: datosEntrega.direccionEntrega,
        telefonoContacto: datosEntrega.telefonoContacto,
        metodoPago: datosEntrega.metodoPago,
      });

      toast.success("¡Pedido realizado con éxito!");
      navigate("/mispedidos");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Error al procesar el pedido");
      setProcesandoPago(false);
    }
  };

  const formatearNumeroTarjeta = (valor) => {
    const numero = valor.replace(/\s/g, "").replace(/\D/g, "");
    const grupos = numero.match(/.{1,4}/g);
    return grupos ? grupos.join(" ") : numero;
  };

  const formatearFechaVencimiento = (valor) => {
    const limpio = valor.replace(/\D/g, "");
    if (limpio.length >= 2) {
      return limpio.slice(0, 2) + "/" + limpio.slice(2, 4);
    }
    return limpio;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <button
          onClick={() => navigate("/carrito")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Volver al carrito</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Finalizar Compra
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de pago */}
          <div className="lg:col-span-2 space-y-6">
            {/* Datos de Entrega */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="text-orange-600" size={24} />
                Datos de Entrega
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dirección de Entrega *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Av. Principal 123, Lima"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Teléfono de Contacto *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej: 999 999 999"
                    maxLength="9"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                    value={datosEntrega.telefonoContacto}
                    onChange={(e) =>
                      setDatosEntrega({
                        ...datosEntrega,
                        telefonoContacto: e.target.value.replace(/\D/g, ""),
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Método de Pago */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Wallet className="text-orange-600" size={24} />
                Método de Pago
              </h2>

              <div className="space-y-3 mb-6">
                {/* Opción: Tarjeta */}
                <button
                  onClick={() =>
                    setDatosEntrega({ ...datosEntrega, metodoPago: "TARJETA" })
                  }
                  className={`w-full flex items-center gap-4 p-4 border-2 rounded-lg transition ${
                    datosEntrega.metodoPago === "TARJETA"
                      ? "border-orange-600 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <CreditCard
                    size={24}
                    className={
                      datosEntrega.metodoPago === "TARJETA"
                        ? "text-orange-600"
                        : "text-gray-400"
                    }
                  />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">
                      Tarjeta de Crédito/Débito
                    </p>
                    <p className="text-sm text-gray-500">
                      Visa, Mastercard, American Express
                    </p>
                  </div>
                </button>

                {/* Opción: Yape */}
                <button
                  onClick={() =>
                    setDatosEntrega({ ...datosEntrega, metodoPago: "YAPE" })
                  }
                  className={`w-full flex items-center gap-4 p-4 border-2 rounded-lg transition ${
                    datosEntrega.metodoPago === "YAPE"
                      ? "border-orange-600 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Smartphone
                    size={24}
                    className={
                      datosEntrega.metodoPago === "YAPE"
                        ? "text-orange-600"
                        : "text-gray-400"
                    }
                  />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Yape / Plin</p>
                    <p className="text-sm text-gray-500">
                      Pago mediante código QR
                    </p>
                  </div>
                </button>

                {/* Opción: Efectivo */}
                <button
                  onClick={() =>
                    setDatosEntrega({ ...datosEntrega, metodoPago: "EFECTIVO" })
                  }
                  className={`w-full flex items-center gap-4 p-4 border-2 rounded-lg transition ${
                    datosEntrega.metodoPago === "EFECTIVO"
                      ? "border-orange-600 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Wallet
                    size={24}
                    className={
                      datosEntrega.metodoPago === "EFECTIVO"
                        ? "text-orange-600"
                        : "text-gray-400"
                    }
                  />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">
                      Pago contra entrega
                    </p>
                    <p className="text-sm text-gray-500">
                      Paga en efectivo al recibir
                    </p>
                  </div>
                </button>
              </div>

              {/* Formulario de Tarjeta */}
              {datosEntrega.metodoPago === "TARJETA" && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Datos de la Tarjeta
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Tarjeta *
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                      value={datosTarjeta.numeroTarjeta}
                      onChange={(e) =>
                        setDatosTarjeta({
                          ...datosTarjeta,
                          numeroTarjeta: formatearNumeroTarjeta(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Titular *
                    </label>
                    <input
                      type="text"
                      placeholder="JUAN PEREZ"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition uppercase"
                      value={datosTarjeta.nombreTitular}
                      onChange={(e) =>
                        setDatosTarjeta({
                          ...datosTarjeta,
                          nombreTitular: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Vencimiento *
                      </label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        maxLength="5"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                        value={datosTarjeta.fechaVencimiento}
                        onChange={(e) =>
                          setDatosTarjeta({
                            ...datosTarjeta,
                            fechaVencimiento: formatearFechaVencimiento(
                              e.target.value
                            ),
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        maxLength="3"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                        value={datosTarjeta.cvv}
                        onChange={(e) =>
                          setDatosTarjeta({
                            ...datosTarjeta,
                            cvv: e.target.value.replace(/\D/g, ""),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Sección de Yape */}
              {datosEntrega.metodoPago === "YAPE" && (
                <div className="mt-6 p-6 bg-linear-to-br from-purple-50 to-pink-50 rounded-lg text-center">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Escanea el código QR para pagar
                  </h3>

                  {/* Aquí va tu imagen QR */}
                  <div className="bg-white p-4 rounded-lg inline-block mb-4 shadow-md">
                    <img
                      src="https://i.ibb.co/Q76SkCcW/Whats-App-Image-2025-11-28-at-10-14-47-PM.jpg"
                      alt="Código QR Yape"
                      className="w-80 h-84 object-cover"
                    />
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    Monto a pagar:{" "}
                    <span className="font-bold text-lg text-purple-600">
                      S/ {carrito?.subtotal.toFixed(2)}
                    </span>
                  </p>

                  <div className="bg-white p-4 rounded-lg">
                    <label className="flex items-center justify-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pagoYapeCompletado}
                        onChange={(e) =>
                          setPagoYapeCompletado(e.target.checked)
                        }
                        className="w-5 h-5 text-orange-600 focus:ring-orange-500 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Ya realicé el pago con Yape
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Mensaje para pago en efectivo */}
              {datosEntrega.metodoPago === "EFECTIVO" && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Nota:</strong> Pagarás en efectivo al momento de
                    recibir tu pedido. Asegúrate de tener el monto exacto.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Resumen del Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Resumen del Pedido
              </h2>

              <div className="space-y-3 mb-6">
                {carrito?.items.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 pb-3 border-b border-gray-100"
                  >
                    <img
                      src={item.imagenUrl || "/placeholder.png"}
                      alt={item.nombreProducto}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.nombreProducto}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.cantidad} x S/ {item.precioUnitario.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      S/ {item.subtotal.toFixed(2)}
                    </p>
                  </div>
                ))}

                {carrito && carrito.items.length > 3 && (
                  <p className="text-sm text-gray-500 text-center">
                    + {carrito.items.length - 3} productos más
                  </p>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>S/ {carrito?.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-orange-600">
                    S/ {carrito?.subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleFinalizarCompra}
                disabled={procesandoPago}
                className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {procesandoPago ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Confirmar Pedido
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Al confirmar aceptas nuestros términos y condiciones
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}