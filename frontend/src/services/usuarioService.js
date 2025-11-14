import { API_ENDPOINTS } from '../config/api';

/**
 * Servicio para manejar operaciones relacionadas con usuarios
 */
const usuarioService = {
  /**
   * Registra un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async registrarUsuario(userData) {
    try {
      const response = await fetch(API_ENDPOINTS.REGISTRO, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Si hay errores de validación, los formateamos
        if (data.errors) {
          const errores = Object.values(data.errors).join(', ');
          throw new Error(errores);
        }
        throw new Error(data.message || 'Error al registrar usuario');
      }

      return data;
    } catch (error) {
      console.error('Error en registrarUsuario:', error);
      throw error;
    }
  },

  /**
   * Verifica si un email está disponible
   * @param {string} email - Email a verificar
   * @returns {Promise<boolean>} true si está disponible
   */
  async verificarEmail(email) {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.VERIFICAR_EMAIL}?email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        throw new Error('Error al verificar email');
      }

      const data = await response.json();
      return data.disponible;
    } catch (error) {
      console.error('Error en verificarEmail:', error);
      throw error;
    }
  },
};

export default usuarioService;