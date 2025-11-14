// Configuración base del API
const API_BASE_URL = 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  REGISTRO: `${API_BASE_URL}/usuarios/registro`,
  VERIFICAR_EMAIL: `${API_BASE_URL}/usuarios/verificar-email`,
  LOGIN: `${API_BASE_URL}/auth/login`, // Para después
};

export default API_BASE_URL;