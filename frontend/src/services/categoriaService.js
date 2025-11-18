import { API_ENDPOINTS } from "../config/api";

/**
 * Servicio para manejar operaciones relacionadas con categorías y subcategorías
 */
const categoriaService = {
  /**
   * Obtiene todas las categorías
   * @returns {Promise<Array>} Lista de categorías
   */
  async obtenerCategorias() {
    try {
      const response = await fetch(API_ENDPOINTS.PUBLIC_CATEGORIAS, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Error al obtener categorías");
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error en obtenerCategorias:", error);
      throw error;
    }
  },

  /**
   * Obtiene todas las subcategorías
   * @returns {Promise<Array>} Lista de subcategorías
   */
  async obtenerSubcategorias() {
    try {
      const response = await fetch(API_ENDPOINTS.PUBLIC_SUBCATEGORIAS, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Error al obtener subcategorías");
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error en obtenerSubcategorias:", error);
      throw error;
    }
  },

  /**
   * Obtiene subcategorías por categoría
   * @param {number} categoriaId - ID de la categoría
   * @returns {Promise<Array>} Lista de subcategorías
   */
  async obtenerSubcategoriasPorCategoria(categoriaId) {
    try {
      const response = await fetch(
        API_ENDPOINTS.PUBLIC_SUBCATEGORIAS_POR_CATEGORIA(categoriaId),
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener subcategorías");
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error en obtenerSubcategoriasPorCategoria:", error);
      throw error;
    }
  },
};

export default categoriaService;
