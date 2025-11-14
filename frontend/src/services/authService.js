import { API_ENDPOINTS } from '../config/api';

/**
 * Servicio para manejar autenticación
 */
const authService = {
  /**
   * Inicia sesión con email y password
   * @param {Object} credentials - Credenciales del usuario
   * @returns {Promise<Object>} Datos del usuario y token
   */
  async login(credentials) {
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // Guardar token y usuario en localStorage
      if (data.success && data.data) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('usuario', JSON.stringify(data.data.usuario));
      }

      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  /**
   * Cierra la sesión del usuario
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },

  /**
   * Obtiene el usuario actual del localStorage
   * @returns {Object|null} Usuario actual o null
   */
  getCurrentUser() {
    const usuarioStr = localStorage.getItem('usuario');
    return usuarioStr ? JSON.parse(usuarioStr) : null;
  },

  /**
   * Obtiene el token actual
   * @returns {string|null} Token o null
   */
  getToken() {
    return localStorage.getItem('token');
  },

  /**
   * Verifica si hay un usuario logueado
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getToken() && !!this.getCurrentUser();
  },
};

export default authService;