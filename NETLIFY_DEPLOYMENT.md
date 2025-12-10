# Guía de Despliegue en Netlify

## Arquitectura de Despliegue

Este proyecto utiliza una arquitectura dividida para el despliegue:

- **Frontend (React)**: Desplegado en Netlify
- **Backend (Node.js + Socket.IO)**: Debe permanecer en Railway, Render, o similar

**¿Por qué?** Netlify es excelente para sitios estáticos y funciones serverless, pero no soporta WebSockets/Socket.IO que son esenciales para las notificaciones en tiempo real de este proyecto.

## Despliegue del Frontend en Netlify

### Opción 1: Despliegue desde GitHub (Recomendado)

#### 1. Conectar Repositorio

1. Ve a [Netlify](https://netlify.com) y crea una cuenta
2. Haz clic en "Add new site" → "Import an existing project"
3. Conecta tu cuenta de GitHub
4. Selecciona el repositorio `jbarahona31/CAFETERIA`
5. Autoriza el acceso

#### 2. Configurar Build Settings

Netlify detectará automáticamente la configuración del archivo `netlify.toml`, pero verifica:

- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/dist`

#### 3. Configurar Variables de Entorno

En Site settings → Environment variables, agrega:

```
VITE_API_URL=https://tu-backend.up.railway.app/api
VITE_SOCKET_URL=https://tu-backend.up.railway.app
```

⚠️ **Importante**: Reemplaza `tu-backend.up.railway.app` con la URL real de tu backend en Railway (o el servicio que uses).

#### 4. Desplegar

1. Haz clic en "Deploy site"
2. Netlify construirá y desplegará automáticamente
3. Obtendrás una URL como: `https://tu-sitio.netlify.app`

### Opción 2: Despliegue con Netlify CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Autenticar
netlify login

# Desde la raíz del proyecto
netlify init

# Seguir el asistente:
# - Create & configure a new site
# - Team: Tu equipo
# - Site name: el-sabor-colombiano (o el que prefieras)
# - Build command: npm run build
# - Directory to deploy: frontend/dist
# - Base directory: frontend

# Configurar variables de entorno
netlify env:set VITE_API_URL "https://tu-backend.up.railway.app/api"
netlify env:set VITE_SOCKET_URL "https://tu-backend.up.railway.app"

# Desplegar
netlify deploy --prod
```

## Configuración del Backend (Railway)

Para que el frontend en Netlify funcione con el backend en Railway:

### 1. Actualizar CORS en el Backend

Asegúrate de que el backend permita requests desde tu dominio de Netlify:

```javascript
// En backend/src/index.js - Ya está configurado
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL,
      'https://tu-sitio.netlify.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'https://tu-sitio.netlify.app'
  ]
}));
```

### 2. Configurar Variable de Entorno

En Railway, agrega la URL de Netlify:

```
FRONTEND_URL=https://tu-sitio.netlify.app
```

## URLs Finales

Después del despliegue tendrás:

- **Frontend**: `https://tu-sitio.netlify.app`
- **Backend API**: `https://tu-backend.up.railway.app/api`
- **WebSocket**: `https://tu-backend.up.railway.app`

## Despliegue Automático (CI/CD)

### GitHub + Netlify

Netlify desplegará automáticamente cuando:
1. Hagas push a la rama principal (main/master)
2. O a la rama que configures como producción

Para configurar una rama específica:
1. Site settings → Build & deploy → Deploy contexts
2. Configura las ramas de producción y preview

### Previews de Pull Requests

Netlify crea automáticamente:
- **Deploy Previews**: Para cada PR
- **Branch Deploys**: Para ramas específicas

Puedes ver los previews en el PR de GitHub.

## Dominio Personalizado

### Agregar Dominio Propio

1. Ve a Site settings → Domain management
2. Haz clic en "Add custom domain"
3. Ingresa tu dominio (ej: `elsaborcolombiano.com`)
4. Sigue las instrucciones para configurar DNS

### Configuración DNS

Opción A - Netlify DNS (Recomendado):
- Cambia los nameservers de tu dominio a los de Netlify

Opción B - DNS Externo:
- Agrega un registro CNAME apuntando a tu sitio de Netlify
- O un registro A con la IP de Netlify

### HTTPS/SSL

Netlify proporciona automáticamente:
- Certificado SSL gratuito (Let's Encrypt)
- HTTPS forzado
- Se renueva automáticamente

## Optimizaciones

### 1. Configuración de Cache

Ya configurado en `netlify.toml`:
- Assets estáticos: 1 año
- Imágenes y sonidos: 1 año

### 2. Compresión

Netlify comprime automáticamente:
- Gzip para todos los archivos de texto
- Brotli cuando el navegador lo soporta

### 3. CDN Global

Tu sitio se distribuye automáticamente en el CDN global de Netlify para tiempos de carga rápidos.

## Solución de Problemas

### Error: Build failed

**Síntoma**: El build falla en Netlify

**Solución**:
1. Verifica los logs de build en Netlify
2. Asegúrate de que `frontend/package.json` tenga todas las dependencias
3. Prueba el build localmente:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

### Error: API no responde

**Síntoma**: El frontend carga pero no muestra productos

**Solución**:
1. Verifica que `VITE_API_URL` esté configurado correctamente
2. Verifica que el backend en Railway esté corriendo
3. Revisa la consola del navegador (F12) para errores CORS
4. Verifica que el backend tenga configurada la URL de Netlify en CORS

### Error: Socket.IO no conecta

**Síntoma**: No hay notificaciones en tiempo real

**Solución**:
1. Verifica que `VITE_SOCKET_URL` esté configurado
2. Verifica que apunte a la URL del backend (Railway)
3. Revisa la consola del navegador para errores de conexión
4. Asegúrate de que el backend tenga CORS configurado para WebSocket

### Error: Rutas devuelven 404

**Síntoma**: Rutas como `/carrito` o `/meseros` devuelven 404

**Solución**:
- El archivo `netlify.toml` ya tiene configurados los redirects
- Verifica que el archivo esté en la raíz del proyecto
- Netlify debe leer la configuración automáticamente

## Monitoreo y Analytics

### Netlify Analytics

1. Ve a Site settings → Analytics
2. Activa Netlify Analytics (tiene costo adicional)
3. Obtendrás métricas de:
   - Page views
   - Unique visitors
   - Bandwidth
   - Top pages

### Logs de Deploy

1. Ve a Deploys
2. Selecciona un deploy
3. Ver "Deploy log" para detalles del build

## Variables de Entorno en Diferentes Contextos

Puedes configurar diferentes valores para:
- **Production**: Deploy de la rama principal
- **Deploy Previews**: PRs y branches
- **Branch deploys**: Ramas específicas

```bash
# Producción
netlify env:set VITE_API_URL "https://api.produccion.com" --context production

# Preview
netlify env:set VITE_API_URL "https://api.staging.com" --context deploy-preview

# Desarrollo
netlify env:set VITE_API_URL "https://api.dev.com" --context branch-deploy
```

## Alternativas para el Backend

Si deseas migrar también el backend de Railway, considera:

### Render
- Soporta WebSockets
- PostgreSQL incluido
- Deploy automático desde GitHub
- Plan gratuito disponible

### Heroku
- Soporta WebSockets
- Add-ons para PostgreSQL
- Deploy desde GitHub

### DigitalOcean App Platform
- Soporta WebSockets
- Managed databases
- $5/mes

## Costos

### Netlify
- **Starter (Gratis)**:
  - 100 GB bandwidth/mes
  - 300 build minutes/mes
  - Deploy automático
  - HTTPS incluido
  
- **Pro ($19/mes)**:
  - 400 GB bandwidth
  - 1000 build minutes
  - Más funcionalidades

### Backend (Railway - Actual)
- $5/mes por servicio
- PostgreSQL: $5/mes adicional
- Total: ~$10/mes

## Recursos Adicionales

- [Documentación de Netlify](https://docs.netlify.com/)
- [Netlify CLI](https://cli.netlify.com/)
- [Netlify Status](https://www.netlifystatus.com/)
- [Comunidad de Netlify](https://answers.netlify.com/)

---

✨ **Nota**: Esta configuración mantiene la funcionalidad completa del proyecto incluyendo WebSockets para notificaciones en tiempo real.
