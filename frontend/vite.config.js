import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use environment variable to determine build output
// For Netlify: uses 'dist' (default)
// For Railway fullstack: uses '../backend/dist'
const outDir = process.env.BUILD_TARGET === 'railway-fullstack' 
  ? '../backend/dist' 
  : 'dist'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: outDir,
    emptyOutDir: true
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // 👈 aquí el puerto correcto
        changeOrigin: true
      }
    }
  }
})
