// URL base del backend
export const API_BASE_URL = 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  // Usuarios
  REGISTRO: `${API_BASE_URL}/usuarios/registro`,
  VERIFICAR_EMAIL: `${API_BASE_URL}/usuarios/verificar-email`,
  LOGIN: `${API_BASE_URL}/auth/login`,

  // Solicitudes de proveedor (usuarios normales)
  CREAR_SOLICITUD: `${API_BASE_URL}/usuario/proveedor/solicitar`,
  MI_SOLICITUD: `${API_BASE_URL}/usuario/proveedor/mi-solicitud`,
  VERIFICAR_SOLICITUD: `${API_BASE_URL}/usuario/proveedor/verificar`,

  // Admin (opcional)
  ADMIN_SOLICITUDES: `${API_BASE_URL}/admin/proveedores/solicitudes`,
  ADMIN_SOLICITUDES_PENDIENTES: `${API_BASE_URL}/admin/proveedores/solicitudes/pendientes`,
  ADMIN_CAMBIAR_ESTADO: (id) => `${API_BASE_URL}/admin/proveedores/${id}/estado`,
  ADMIN_LISTAR_USUARIOS: `${API_BASE_URL}/admin/usuarios/lista`,

};

export default API_BASE_URL;
