/**
 * 🔧 Configuración Centralizada de API
 * 
 * Este archivo maneja automáticamente las URLs del backend
 * según el entorno (desarrollo/producción)
 */

// Detectar entorno
const isDevelopment = import.meta.env.DEV
const isProduction = import.meta.env.PROD

// Configuración principal
export const API_CONFIG = {
  // URL base de la API
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  
  // URL de WebSocket
  socketURL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000',
  
  // Configuración adicional
  timeout: 30000, // 30 segundos
  withCredentials: true,
  
  // Headers comunes
  headers: {
    'Content-Type': 'application/json',
  }
}

// Función helper para obtener headers con token
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

// Log de configuración en desarrollo
if (isDevelopment) {
  console.log('🔧 API Configuration:', {
    baseURL: API_CONFIG.baseURL,
    socketURL: API_CONFIG.socketURL,
    environment: 'development'
  })
}

export default API_CONFIG
