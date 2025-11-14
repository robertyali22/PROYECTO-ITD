import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import authService from "../services/authService";

export default function LoginModal({ isOpen, onClose }) {
  const [credenciales, setCredenciales] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Estados para montar y controlar la animación (entrada/salida)
  const ANIM_DURATION = 150;
  const [visible, setVisible] = useState(false); // si el modal está montado
  const [show, setShow] = useState(false); // si debe mostrarse (clase abierta)

  useEffect(() => {
    let timeoutId;
    if (isOpen) {
      // Montamos y en el siguiente frame activamos la clase para que la transición de entrada se vea
      setVisible(true);
      // requestAnimationFrame asegura que el DOM se haya renderizado con el estado inicial antes de cambiar la clase
      requestAnimationFrame(() => setShow(true));
    } else {
      // Iniciamos animación de salida y desmontamos después de la duración
      setShow(false);
      timeoutId = setTimeout(() => setVisible(false), ANIM_DURATION);
    }
    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredenciales({
      ...credenciales,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!credenciales.email.trim()) {
      nuevosErrores.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(credenciales.email)) {
      nuevosErrores.email = "Email inválido";
    }

    if (!credenciales.password) {
      nuevosErrores.password = "La contraseña es obligatoria";
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      toast.error("Por favor, corrige los errores del formulario");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login(credenciales);

      if (response.success) {
        toast.success(`¡Bienvenido ${response.data.usuario.nombre}!`);

        setCredenciales({
          email: "",
          password: "",
        });

        onClose();
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.message || "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  // Si no estamos montados (ni en entrada ni saliendo) no renderizamos
  if (!visible) return null;

  return (
    <div
      // Backdrop con transición de opacidad (150ms ease-in-out)
      className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-150 ease-in-out ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        // Diálogo con transform + opacity, entrada/salida suave en 150ms
        className={`bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all duration-150 ease-in-out ${
          show ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"
        }`}
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Iniciar Sesión
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <input
              type="email"
              name="email"
              value={credenciales.email}
              onChange={handleChange}
              placeholder="Correo electrónico"
              disabled={loading}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={credenciales.password}
              onChange={handleChange}
              placeholder="Contraseña"
              disabled={loading}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-3 py-2 rounded-lg font-medium transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700 text-white"
            }`}
          >
            {loading ? "Iniciando sesión..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}