const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Servicio para manejar categorías y subcategorías
 */
const categoriaService = {
  /**
   * Obtiene todas las categorías
   */
  async obtenerCategorias() {
    try {
      const response = await fetch(`${API_BASE_URL}/public/categorias`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener categorías');
      }

      return data.data;
    } catch (error) {
      console.error('Error en obtenerCategorias:', error);
      throw error;
    }
  },

  /**
   * Obtiene todas las subcategorías
   */
  async obtenerSubcategorias() {
    try {
      const response = await fetch(`${API_BASE_URL}/public/categorias/subcategorias`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener subcategorías');
      }

      return data.data;
    } catch (error) {
      console.error('Error en obtenerSubcategorias:', error);
      throw error;
    }
  },

  /**
   * Obtiene subcategorías de una categoría específica
   */
  async obtenerSubcategoriasPorCategoria(categoriaId) {
    try {
      const response = await fetch(`${API_BASE_URL}/public/categorias/${categoriaId}/subcategorias`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener subcategorías');
      }

      return data.data;
    } catch (error) {
      console.error('Error en obtenerSubcategoriasPorCategoria:', error);
      throw error;
    }
  },
};

export default categoriaService;