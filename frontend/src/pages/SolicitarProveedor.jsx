import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Building2,
  FileText,
  Phone,
  Mail,
  Send,
  ArrowLeft,
} from "lucide-react";
import solicitudService from "../services/solicitudService";

export default function SolicitarProveedor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ruc: "",
    nombreEmpresa: "",
    razonSocial: "",
    descripcion: "",
    direccion: "",
    telefonoEmpresa: "",
    emailEmpresa: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await solicitudService.crearSolicitud(formData);
      toast.success(
        "¡Solicitud enviada exitosamente! Espera la aprobación del administrador."
      );
      navigate("/Miperfil");
    } catch (error) {
      toast.error(error.message || "Error al enviar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Solicitar ser Proveedor
          </h1>
          <p className="text-gray-600">
            Completa el formulario para enviar tu solicitud. Un administrador la
            revisará pronto.
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-6">
            {/* Nombre de Empresa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 className="inline w-4 h-4 mr-2" />
                Nombre de la Empresa *
              </label>
              <input
                type="text"
                name="nombreEmpresa"
                value={formData.nombre_empresa}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                placeholder="Ej: Distribuidora ABC SAC"
              />
            </div>

            {/* RUC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline w-4 h-4 mr-2" />
                RUC *
              </label>
              <input
                type="text"
                name="ruc"
                value={formData.ruc}
                onChange={handleChange}
                required
                pattern="[0-9]{11}"
                maxLength="11"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                placeholder="20123456789"
              />
              <p className="mt-1 text-xs text-gray-500">
                Debe contener 11 dígitos
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline w-4 h-4 mr-2" />
                Email de la Empresa *
              </label>
              <input
                type="emailEmpresa"
                name="emailEmpresa"
                value={formData.emailEmpresa}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                placeholder="contacto@empresa.com"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline w-4 h-4 mr-2" />
                Teléfono *
              </label>
              <input
                type="tel"
                name="telefonoEmpresa"
                value={formData.telefonoEmpresa}
                onChange={handleChange}
                required
                pattern="[0-9]{9}"
                maxLength="9"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                placeholder="987654321"
              />
              <p className="mt-1 text-xs text-gray-500">
                9 dígitos sin espacios
              </p>
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección *
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                placeholder="Av. Principal 123, Lima"
              />
            </div>
            {/* Razon social */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Razon Social *
              </label>
              <input
                type="text"
                name="razonSocial"
                value={formData.razonSocial}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                placeholder="Ingrese la razon social de su empresa"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción de tu Empresa *
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
                placeholder="Describe brevemente tu empresa, productos que ofreces, experiencia en el rubro, etc."
              />
              <p className="mt-1 text-xs text-gray-500">
                Mínimo 50 caracteres - {formData.descripcion.length}/50
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || formData.descripcion.length < 50}
                className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar Solicitud
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Nota informativa */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Una vez enviada tu solicitud, un
            administrador la revisará. Recibirás una notificación cuando sea
            aprobada o rechazada. El proceso puede tomar entre 24-48 horas
            hábiles.
          </p>
        </div>
      </div>
    </div>
  );
}
