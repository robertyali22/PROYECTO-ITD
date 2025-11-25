// URL base del backend
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const API_ENDPOINTS = {
  // Usuarios
  REGISTRO: `${API_BASE_URL}/usuarios/registro`,
  VERIFICAR_EMAIL: `${API_BASE_URL}/usuarios/verificar-email`,
  LOGIN: `${API_BASE_URL}/auth/login`,

  // Solicitudes de proveedor (usuarios normales)
  CREAR_SOLICITUD: `${API_BASE_URL}/usuario/proveedor/solicitar`,
  MI_SOLICITUD: `${API_BASE_URL}/usuario/proveedor/mi-solicitud`,
  VERIFICAR_SOLICITUD: `${API_BASE_URL}/usuario/proveedor/verificar`,

  // Admin
  ADMIN_SOLICITUDES: `${API_BASE_URL}/admin/proveedores/solicitudes`,
  ADMIN_SOLICITUDES_PENDIENTES: `${API_BASE_URL}/admin/proveedores/solicitudes/pendientes`,
  ADMIN_CAMBIAR_ESTADO: (id) => `${API_BASE_URL}/admin/proveedores/${id}/estado`,
  ADMIN_LISTAR_USUARIOS: `${API_BASE_URL}/admin/usuarios/lista`,

  // Productos - Proveedor
  PROVEEDOR_PRODUCTOS: `${API_BASE_URL}/proveedor/productos`,
  PROVEEDOR_PRODUCTO_DETALLE: (id) => `${API_BASE_URL}/proveedor/productos/${id}`,
  PROVEEDOR_PRODUCTO_ACTUALIZAR: (id) => `${API_BASE_URL}/proveedor/productos/${id}`,
  PROVEEDOR_PRODUCTO_ELIMINAR: (id) => `${API_BASE_URL}/proveedor/productos/${id}`,
  PROVEEDOR_AGREGAR_IMAGEN: (productoId) => `${API_BASE_URL}/proveedor/productos/${productoId}/imagenes`,
  PROVEEDOR_ELIMINAR_IMAGEN: (productoId, imagenId) => `${API_BASE_URL}/proveedor/productos/${productoId}/imagenes/${imagenId}`,

  // Productos - Público
  PUBLIC_PRODUCTOS: `${API_BASE_URL}/public/productos`,
  PUBLIC_PRODUCTOS_CATEGORIA: (categoriaId) => `${API_BASE_URL}/public/productos/categoria/${categoriaId}`,

  // Categorías - Público
  PUBLIC_CATEGORIAS: `${API_BASE_URL}/public/categorias`,
  PUBLIC_SUBCATEGORIAS: `${API_BASE_URL}/public/categorias/subcategorias`,
  PUBLIC_SUBCATEGORIAS_POR_CATEGORIA: (categoriaId) => `${API_BASE_URL}/public/categorias/${categoriaId}/subcategorias`,

  // Carrito
  CARRITO_AGREGAR: `${API_BASE_URL}/usuario/carrito`,
  CARRITO_OBTENER: `${API_BASE_URL}/usuario/carrito`,
  CARRITO_COUNT: `${API_BASE_URL}/usuario/carrito/count`,
  CARRITO_ACTUALIZAR: (carritoId) => `${API_BASE_URL}/usuario/carrito/${carritoId}`,
  CARRITO_ELIMINAR: (carritoId) => `${API_BASE_URL}/usuario/carrito/${carritoId}`,
  CARRITO_VACIAR: `${API_BASE_URL}/usuario/carrito`,
  CARRITO_LIMPIAR: `${API_BASE_URL}/usuario/carrito/limpiar`,
};

export default API_BASE_URL;