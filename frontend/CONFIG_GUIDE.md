# 🔧 Guía de Configuración Frontend

## Variables de Entorno

### Desarrollo Local

Crear archivo `.env.local`:

```env
VITE_API_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

### Producción (Netlify)

1. Actualizar `.env.production` con tu URL real de Railway
2. Configurar en Netlify → Site Settings → Environment Variables:
   - `VITE_API_URL`: `https://tu-backend.up.railway.app/api`
   - `VITE_SOCKET_URL`: `https://tu-backend.up.railway.app`

## Comandos

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Actualizar URLs en archivos HTML
npm run update-urls https://tu-backend.up.railway.app

# Vista previa del build
npm run preview
```

## Verificación

1. Backend corriendo en el puerto esperado
2. No hay errores CORS en la consola
3. WebSocket conectado correctamente
4. Las peticiones API funcionan

## ⚠️ IMPORTANTE

**NO MODIFICAR ningún archivo del backend.** Todos los cambios son exclusivamente en el frontend.

## ✅ Beneficios de estos cambios

1. **Configuración centralizada**: Una sola fuente de verdad para las URLs
2. **Fácil despliegue**: Variables de entorno separan desarrollo de producción
3. **Mejor mantenibilidad**: No más URLs hardcodeadas en múltiples archivos
4. **Scripts automáticos**: Herramientas para actualizar configuraciones rápidamente
5. **Mejor debugging**: Logs claros de configuración en desarrollo
6. **Sin modificar backend**: Todos los cambios son solo en frontend

## 📝 Notas

- Los archivos `.env.local` son ignorados por git (no se suben al repo)
- El archivo `.env.production` debe actualizarse con la URL real antes del deploy
- El script `update-html-urls.js` ayuda a actualizar los archivos HTML legacy
