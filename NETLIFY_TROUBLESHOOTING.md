# Solución de Problemas - Netlify

Guía completa para resolver problemas comunes al desplegar en Netlify.

## 🔍 Diagnóstico Rápido

Antes de buscar el problema específico, ejecuta estas verificaciones:

### 1. Verificar Build
```bash
cd frontend
npm install
npm run build
```
✅ Si funciona → El problema es configuración  
❌ Si falla → Ver sección "Build Failures"

### 2. Verificar API
Abre la consola del navegador (F12) y busca errores relacionados con:
- CORS
- Network failed
- 404 en llamadas a API

### 3. Verificar Variables de Entorno
En Netlify Dashboard:
- Site settings → Environment variables
- Verifica que `VITE_API_URL` y `VITE_SOCKET_URL` estén configuradas

---

## 🚨 Problemas Comunes

### Problema 1: Build Failed en Netlify

#### Síntoma
```
Build failed
npm ERR! code ELIFECYCLE
```

#### Causas Posibles

**A. Dependencias faltantes**

Verifica que todas las dependencias estén en `frontend/package.json`:
```bash
cd frontend
npm install
npm run build
```

Si falla localmente, agrega la dependencia faltante:
```bash
npm install [paquete-faltante] --save
```

**B. Node version incorrecta**

Verifica la versión de Node:
- El proyecto requiere Node 18+
- Netlify usa la versión en `.nvmrc` o `NODE_VERSION` en `netlify.toml`

Solución:
1. Verifica que el archivo `.nvmrc` en la raíz del proyecto tenga `18`
2. O en `netlify.toml` bajo `[build.environment]` tenga `NODE_VERSION = "18"`

**C. Base directory incorrecta**

En Site settings → Build & deploy → Build settings:
- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `frontend/dist`

**D. Variables de entorno faltantes**

Aunque las variables no son requeridas para el build, algunos archivos pueden referenciarlas.

Solución: Agrega variables de entorno en Netlify (pueden ser temporales para el build):
```
VITE_API_URL=https://placeholder.com/api
VITE_SOCKET_URL=https://placeholder.com
```

---

### Problema 2: Página en blanco / No carga

#### Síntoma
El sitio despliega correctamente pero muestra una página en blanco.

#### Causas Posibles

**A. Ruta de publicación incorrecta**

Verifica en Netlify:
- Publish directory debe ser: `frontend/dist` (no solo `dist`)

**B. Error en JavaScript**

Abre la consola del navegador (F12) y busca errores rojos.

**C. Variables de entorno mal configuradas**

Verifica en Site settings → Environment variables:
```
VITE_API_URL=https://tu-backend.up.railway.app/api
VITE_SOCKET_URL=https://tu-backend.up.railway.app
```

⚠️ **Importante**: Después de cambiar variables de entorno, debes hacer un nuevo deploy:
- Deploys → Trigger deploy → Clear cache and deploy site

---

### Problema 3: No se muestran productos / API no responde

#### Síntoma
El sitio carga pero no muestra productos o datos.

#### Diagnóstico

Abre la consola del navegador (F12) → Network tab

**A. Error CORS**
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**Solución**:

1. En tu backend (Railway), agrega la URL de Netlify a `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://tu-sitio.netlify.app
   ```
   
   O si ya tienes una URL, agrega la de Netlify separada por coma:
   ```
   FRONTEND_URL=https://railway.app,https://tu-sitio.netlify.app
   ```

2. Redeploy el backend en Railway

3. Verifica que el backend tenga el código CORS actualizado (ya incluido en el proyecto):
   ```javascript
   app.use(cors({
     origin: allowedOrigins,
     credentials: true
   }));
   ```

**B. Error 404 - API not found**
```
GET https://tu-backend.up.railway.app/api/productos 404 (Not Found)
```

**Solución**:
1. Verifica que el backend esté corriendo:
   ```
   curl https://tu-backend.up.railway.app/api/health
   ```
   
2. Verifica las variables de entorno en Netlify:
   ```
   VITE_API_URL=https://tu-backend.up.railway.app/api
   ```
   
   ⚠️ No olvides el `/api` al final

3. Redeploy en Netlify después de corregir

**C. Error de red / Backend no responde**
```
Failed to fetch
Network request failed
```

**Solución**:
1. Verifica que el backend esté corriendo en Railway
2. Revisa los logs del backend en Railway
3. Verifica que no haya problemas de SSL/HTTPS
4. Asegúrate de usar `https://` no `http://`

---

### Problema 4: Rutas no funcionan (404 en /carrito, /meseros)

#### Síntoma
Al navegar directamente a rutas como `/carrito` o `/meseros`, Netlify devuelve 404.

#### Causa
React Router necesita que todas las rutas apunten a `index.html`.

#### Solución

Ya está configurado en `netlify.toml`, pero verifica:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Si el archivo `netlify.toml` no está en la raíz del proyecto, agrégalo.

Alternativa: Crear `frontend/_redirects`:
```
/*    /index.html   200
```

**Redeploy** después de agregar el archivo.

---

### Problema 5: WebSocket no conecta / No hay notificaciones

#### Síntoma
El menú funciona pero no llegan notificaciones en tiempo real.

#### Diagnóstico

Abre la consola del navegador (F12) y busca:
```
WebSocket connection failed
Socket.IO connection error
```

#### Solución

**A. Verifica VITE_SOCKET_URL**

En Netlify → Site settings → Environment variables:
```
VITE_SOCKET_URL=https://tu-backend.up.railway.app
```

⚠️ **Sin** `/api` al final (diferente a VITE_API_URL)

**B. Verifica CORS en Socket.IO**

El backend debe permitir conexiones desde Netlify (ya configurado):
```javascript
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});
```

**C. Railway FRONTEND_URL**

Asegúrate de que Railway tenga la URL de Netlify:
```
FRONTEND_URL=https://tu-sitio.netlify.app
```

**D. Redeploy ambos servicios**
1. Redeploy backend en Railway
2. Redeploy frontend en Netlify (Clear cache and deploy)

---

### Problema 6: Imágenes no cargan

#### Síntoma
El logo u otras imágenes no aparecen.

#### Solución

**A. Verifica la ruta de la imagen**

Las imágenes en `frontend/public/` se acceden como `/imagen.jpg` (no `/public/imagen.jpg`)

Ejemplo:
```jsx
// ✅ Correcto
<img src="/img/LOGO.jpeg" alt="Logo" />

// ❌ Incorrecto
<img src="/public/img/LOGO.jpeg" alt="Logo" />
```

**B. Verifica que la imagen existe**

```bash
ls frontend/public/img/
```

**C. Case sensitivity**

Linux (y Netlify) es case-sensitive:
- `LOGO.jpeg` ≠ `logo.jpeg`

Verifica que el nombre coincida exactamente.

---

### Problema 7: Sonidos no funcionan

#### Síntoma
No se escuchan los sonidos de notificación.

#### Solución

**A. Verifica que los archivos existan**

```bash
ls frontend/public/sounds/
```

Debe mostrar:
- `new-order.mp3`
- `order-ready.mp3`

**B. Permisos del navegador**

Los navegadores modernos requieren interacción del usuario antes de reproducir sonidos.

**C. Formato de audio**

Asegúrate de usar formatos compatibles:
- MP3 (✅ Compatible con todos los navegadores)
- WAV (✅ Compatible)
- OGG (⚠️ No en Safari)

---

### Problema 8: Deploy lento

#### Síntoma
El deploy tarda mucho tiempo.

#### Solución

**A. Cache de dependencias**

Netlify cachea `node_modules` automáticamente, pero si instalas muchas dependencias nuevas puede tardar.

**B. Build time optimization**

Ya optimizado en `netlify.toml`:
```toml
[build]
  command = "npm run build"
```

Vite es muy rápido, el build típico toma 30-60 segundos.

**C. Clear cache**

Si el problema persiste:
1. Deploys → Trigger deploy → Clear cache and deploy site

---

### Problema 9: Certificado SSL / HTTPS

#### Síntoma
Advertencias de seguridad o certificado inválido.

#### Solución

Netlify proporciona SSL automático:
1. Domain settings → HTTPS
2. Verifica que esté habilitado
3. Si usas dominio custom, espera a que se provision el certificado (puede tomar minutos)

**Force HTTPS**: Ya configurado automáticamente por Netlify

---

### Problema 10: Variables de entorno no se actualizan

#### Síntoma
Cambias las variables pero el sitio sigue usando valores antiguos.

#### Solución

Las variables de entorno se inyectan durante el **build time**, no runtime.

Pasos:
1. Actualiza las variables en Site settings → Environment variables
2. **Importante**: Trigger new deploy
   - Deploys → Trigger deploy → Clear cache and deploy site
3. Espera a que termine el deploy
4. Refresca tu navegador (Ctrl+Shift+R para hard refresh)

---

## 🛠️ Herramientas de Diagnóstico

### 1. Netlify CLI

```bash
# Instalar
npm install -g netlify-cli

# Login
netlify login

# Ver logs
netlify logs

# Deploy manual
netlify deploy --prod
```

### 2. Test local

```bash
# Build y preview local
cd frontend
npm install
npm run build
npm run preview

# Debería abrir en http://localhost:4173
```

### 3. Verificar configuración

```bash
# Ver configuración de Netlify
cat netlify.toml

# Ver variables de entorno del frontend
cat frontend/.env.production
```

### 4. Test del backend

```bash
# Verifica que el backend responda
curl https://tu-backend.up.railway.app/api/health

# Debe devolver:
# {"status":"ok","message":"El Sabor Colombiano API is running"}
```

---

## 📞 Obtener Ayuda

### Revisar logs

1. **Build logs**: Netlify Dashboard → Deploys → [último deploy] → Deploy log
2. **Function logs**: Netlify Dashboard → Functions → [función] → Logs
3. **Browser console**: F12 en el navegador → Console tab

### Información para reportar

Si necesitas ayuda, incluye:
- [ ] URL del sitio en Netlify
- [ ] Logs del build (si es error de build)
- [ ] Consola del navegador (si es error en runtime)
- [ ] Variables de entorno configuradas (sin valores sensibles)
- [ ] Versión de Node usada

### Recursos

- [Netlify Support](https://answers.netlify.com/)
- [Netlify Status](https://www.netlifystatus.com/)
- [Documentación oficial](https://docs.netlify.com/)
- [GitHub Issues del proyecto](https://github.com/jbarahona31/CAFETERIA/issues)

---

## ✅ Checklist de Verificación

Antes de reportar un problema, verifica:

- [ ] Build local funciona (`cd frontend && npm run build`)
- [ ] Variables de entorno configuradas en Netlify
- [ ] Base directory es `frontend`
- [ ] Publish directory es `frontend/dist`
- [ ] Backend está corriendo y responde
- [ ] `FRONTEND_URL` incluye la URL de Netlify en el backend
- [ ] Archivo `netlify.toml` está en la raíz del proyecto
- [ ] Has hecho redeploy después de cambiar variables
- [ ] Has refrescado el navegador con hard refresh (Ctrl+Shift+R)

---

¿Encontraste un problema no listado aquí? [Abre un issue en GitHub](https://github.com/jbarahona31/CAFETERIA/issues).
