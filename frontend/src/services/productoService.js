import { API_ENDPOINTS } from '../config/api';

/**
 * Servicio para manejar operaciones relacionadas con productos
 */
const productoService = {
  /**
   * Obtiene el token del localStorage
   * @returns {string} Token de autenticación
   */
  getToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    return token;
  },

  /**
   * Crea un nuevo producto (solo proveedor)
   * @param {Object} productoData - Datos del producto
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async crearProducto(productoData) {
    try {
      const token = this.getToken();

      const response = await fetch(API_ENDPOINTS.PROVEEDOR_PRODUCTOS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productoData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear producto');
      }

      return data;
    } catch (error) {
      console.error('Error en crearProducto:', error);
      throw error;
    }
  },

  /**
   * Obtiene todos los productos del proveedor autenticado
   * @returns {Promise<Array>} Lista de productos
   */
  async obtenerMisProductos() {
    try {
      const token = this.getToken();

      const response = await fetch(API_ENDPOINTS.PROVEEDOR_PRODUCTOS, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener productos');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en obtenerMisProductos:', error);
      throw error;
    }
  },

  /**
   * Obtiene un producto específico por ID
   * @param {number} productoId - ID del producto
   * @returns {Promise<Object>} Datos del producto
   */
  async obtenerProductoPorId(productoId) {
    try {
      const token = this.getToken();

      const response = await fetch(
        API_ENDPOINTS.PROVEEDOR_PRODUCTO_DETALLE(productoId),
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener producto');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en obtenerProductoPorId:', error);
      throw error;
    }
  },

  /**
   * Actualiza un producto existente
   * @param {number} productoId - ID del producto
   * @param {Object} productoData - Datos actualizados
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async actualizarProducto(productoId, productoData) {
    try {
      const token = this.getToken();

      const response = await fetch(
        API_ENDPOINTS.PROVEEDOR_PRODUCTO_ACTUALIZAR(productoId),
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(productoData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar producto');
      }

      return data;
    } catch (error) {
      console.error('Error en actualizarProducto:', error);
      throw error;
    }
  },

  /**
   * Elimina un producto
   * @param {number} productoId - ID del producto
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async eliminarProducto(productoId) {
    try {
      const token = this.getToken();

      const response = await fetch(
        API_ENDPOINTS.PROVEEDOR_PRODUCTO_ELIMINAR(productoId),
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar producto');
      }

      return data;
    } catch (error) {
      console.error('Error en eliminarProducto:', error);
      throw error;
    }
  },

  /**
   * Agrega una imagen a un producto
   * @param {number} productoId - ID del producto
   * @param {string} urlImagen - URL de la imagen
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async agregarImagen(productoId, urlImagen) {
    try {
      const token = this.getToken();

      const response = await fetch(
        API_ENDPOINTS.PROVEEDOR_AGREGAR_IMAGEN(productoId),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ urlImagen }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al agregar imagen');
      }

      return data;
    } catch (error) {
      console.error('Error en agregarImagen:', error);
      throw error;
    }
  },

  /**
   * Elimina una imagen de un producto
   * @param {number} productoId - ID del producto
   * @param {number} imagenId - ID de la imagen
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async eliminarImagen(productoId, imagenId) {
    try {
      const token = this.getToken();

      const response = await fetch(
        API_ENDPOINTS.PROVEEDOR_ELIMINAR_IMAGEN(productoId, imagenId),
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar imagen');
      }

      return data;
    } catch (error) {
      console.error('Error en eliminarImagen:', error);
      throw error;
    }
  },

  /**
   * Obtiene todos los productos públicos
   * @returns {Promise<Array>} Lista de productos
   */
  async obtenerProductosPublicos() {
    try {
      const response = await fetch(API_ENDPOINTS.PUBLIC_PRODUCTOS, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Error al obtener productos');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en obtenerProductosPublicos:', error);
      throw error;
    }
  },

  /**
   * Obtiene productos por categoría
   * @param {number} categoriaId - ID de la categoría
   * @returns {Promise<Array>} Lista de productos
   */
  async obtenerProductosPorCategoria(categoriaId) {
    try {
      const response = await fetch(
        API_ENDPOINTS.PUBLIC_PRODUCTOS_CATEGORIA(categoriaId),
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener productos');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en obtenerProductosPorCategoria:', error);
      throw error;
    }
  },
};

export default productoService;