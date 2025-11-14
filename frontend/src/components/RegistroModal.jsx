import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import usuarioService from "../services/usuarioService";

export default function RegistroModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telefono: "",
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
    setFormData({
      ...formData,
      [name]: value,
    });

    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    }

    if (!formData.apellido.trim()) {
      nuevosErrores.apellido = "El apellido es obligatorio";
    }

    if (!formData.email.trim()) {
      nuevosErrores.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nuevosErrores.email = "Email inválido";
    }

    if (!formData.password) {
      nuevosErrores.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      nuevosErrores.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    if (!validarFormulario()) {
      toast.error("Por favor, corrige los errores del formulario");
      return;
    }

    setLoading(true);

    try {
      // Registrar usuario
      const response = await usuarioService.registrarUsuario(formData);

      if (response.success) {
        toast.success("¡Registro exitoso! Bienvenido " + response.data.nombre);

        // Limpiar formulario
        setFormData({
          nombre: "",
          apellido: "",
          email: "",
          password: "",
          telefono: "",
        });

        // Cerrar modal (dejo el pequeño delay que tenías)
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      toast.error(error.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  // Si no estamos montados (ni en entrada ni saliendo) no renderizamos
  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-150 ease-in-out ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all duration-150 ease-in-out ${
          show ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"
        }`}
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Registro de Usuario
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
          <div className="flex gap-2">
            <div className="w-1/2">
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                  errors.nombre ? "border-red-500" : ""
                }`}
              />
              {errors.nombre && (
                <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
              )}
            </div>

            <div className="w-1/2">
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Apellido"
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                  errors.apellido ? "border-red-500" : ""
                }`}
              />
              {errors.apellido && (
                <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>
              )}
            </div>
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
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
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña (mínimo 6 caracteres)"
              disabled={loading}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Teléfono (opcional)"
              disabled={loading}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
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
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </form>
      </div>
    </div>
  );
}