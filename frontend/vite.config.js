import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno según el modo
  const env = loadEnv(mode, process.cwd(), '')
  
  // Determinar directorio de salida
  const outDir = process.env.BUILD_TARGET === 'railway-fullstack' 
    ? '../backend/dist' 
    : 'dist'

  return {
    plugins: [react()],
    
    build: {
      outDir: outDir,
      emptyOutDir: true,
      sourcemap: mode === 'development'
    },
    
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path
        },
        '/socket.io': {
          target: env.VITE_SOCKET_URL || 'http://localhost:4000',
          changeOrigin: true,
          ws: true
        }
      }
    },
    
    // Variables de entorno expuestas al cliente
    define: {
      __API_URL__: JSON.stringify(env.VITE_API_URL),
      __SOCKET_URL__: JSON.stringify(env.VITE_SOCKET_URL)
    }
  }
})
