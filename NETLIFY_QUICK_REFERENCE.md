# 🚀 Netlify - Referencia Rápida

Tarjeta de referencia rápida para desplegar en Netlify.

## 📋 Checklist de Despliegue

```
Frontend (Netlify):
□ Conectar repositorio en Netlify
□ Base directory: frontend
□ Build command: npm run build
□ Publish directory: frontend/dist
□ VITE_API_URL configurado
□ VITE_SOCKET_URL configurado

Backend (Railway):
□ Backend corriendo
□ FRONTEND_URL incluye URL de Netlify
□ PostgreSQL configurado
□ Variables de entorno configuradas
```

## ⚡ Comandos Rápidos

### Setup Inicial
```bash
# Ejecutar script de configuración
./setup-netlify.sh

# O manualmente con CLI
npm install -g netlify-cli
netlify login
cd frontend
netlify init
```

### Build y Test Local
```bash
cd frontend
npm install
npm run build
ls dist/  # Verificar output
```

### Deploy Manual
```bash
cd frontend
netlify deploy --prod
```

### Ver Logs
```bash
netlify logs
```

## 🔧 Variables de Entorno

### Netlify (Frontend)
```env
VITE_API_URL=https://your-backend.up.railway.app/api
VITE_SOCKET_URL=https://your-backend.up.railway.app
```

### Railway (Backend)
```env
FRONTEND_URL=https://your-site.netlify.app
# O múltiples:
FRONTEND_URL=https://railway.app,https://netlify.app
```

## 🔍 Verificación Rápida

### 1. Build Local
```bash
cd frontend && npm run build
# ✅ Debe crear carpeta dist/
```

### 2. Backend Responde
```bash
curl https://your-backend.up.railway.app/api/health
# ✅ {"status":"ok","message":"El Sabor Colombiano API is running"}
```

### 3. Frontend Carga
```
Abrir: https://your-site.netlify.app
✅ Página carga
✅ Productos se muestran
✅ Sin errores en consola (F12)
```

### 4. WebSocket Funciona
```
1. Ir a /meseros
2. Crear pedido desde el menú
3. ✅ Pedido aparece en tiempo real
```

## 🆘 Solución Rápida de Problemas

### Build Falla
```bash
# Test local
cd frontend
npm install
npm run build

# Si falla → Ver logs de Netlify
# Común: dependencias faltantes, Node version
```

### No Aparecen Productos
```
1. F12 → Console → Ver errores
2. Error CORS? → Actualizar FRONTEND_URL en Railway
3. Error 404? → Verificar VITE_API_URL en Netlify
4. Redeploy Netlify después de cambios
```

### Rutas 404
```
✅ Archivo netlify.toml existe en raíz
✅ Contiene: /* → /index.html (status 200)
✅ Redeploy
```

### WebSocket No Conecta
```
1. Verificar VITE_SOCKET_URL (sin /api)
2. Verificar FRONTEND_URL en Railway
3. Redeploy ambos servicios
```

## 📁 Estructura de Archivos

```
CAFETERIA/
├── netlify.toml              ← Config principal
├── .nvmrc                    ← Node version
├── frontend/
│   ├── _redirects            ← SPA redirects
│   ├── .env.netlify          ← Template vars
│   └── dist/                 ← Build output
├── NETLIFY_QUICK_START.md    ← Guía de 5 min
├── NETLIFY_DEPLOYMENT.md     ← Guía completa
└── NETLIFY_TROUBLESHOOTING.md ← Solución problemas
```

## 🔗 Enlaces Útiles

### Dashboards
- [Netlify Dashboard](https://app.netlify.com/)
- [Railway Dashboard](https://railway.app/)

### Docs del Proyecto
- [Quick Start (5 min)](./NETLIFY_QUICK_START.md)
- [Deployment Guide](./NETLIFY_DEPLOYMENT.md)
- [Troubleshooting](./NETLIFY_TROUBLESHOOTING.md)
- [Comparison](./DEPLOYMENT_COMPARISON.md)
- [Migration Summary](./MIGRATION_SUMMARY.md)

### Docs Oficiales
- [Netlify Docs](https://docs.netlify.com/)
- [Netlify CLI](https://cli.netlify.com/)

## 💡 Tips Rápidos

### Redeploy Limpio
```bash
# En Netlify Dashboard:
Deploys → Trigger deploy → Clear cache and deploy site
```

### Ver Variables
```bash
netlify env:list
```

### Test Build Local
```bash
cd frontend
npm run build
npm run preview  # Preview local
```

### Force HTTPS
```
✅ Automático en Netlify
No requiere configuración
```

## 📊 Costos

| Servicio | Plan | Costo |
|----------|------|-------|
| Netlify | Starter | $0 |
| Railway Backend | Hobby | ~$5 |
| Railway DB | PostgreSQL | ~$5 |
| **Total** | | **~$10/mes** |

## ⚡ Performance

### Con CDN (Netlify + Railway)
- Primera carga: ~200ms
- Con cache: ~50ms
- Global: ✅ Rápido

### Sin CDN (Railway Fullstack)
- Primera carga: ~500ms
- Con cache: ~200ms
- Global: ⚠️ Más lento

## 🎯 Flujo de Trabajo

```
Developer
    ↓ git push
  GitHub
    ↓ webhook
  Netlify ← Build frontend
    ↓ deploy
  CDN (Global)
    ↓ API calls
  Railway ← Backend + DB
```

## 📱 URLs Finales

```
Frontend:  https://your-site.netlify.app
API:       https://your-backend.up.railway.app/api
WebSocket: https://your-backend.up.railway.app
Health:    https://your-backend.up.railway.app/api/health
```

---

## 🚀 TL;DR - Deploy en 3 Pasos

```bash
# 1. Setup (una vez)
./setup-netlify.sh

# 2. Push a GitHub
git push origin main

# 3. ¡Listo!
# Netlify y Railway despliegan automáticamente
```

---

**¿Problemas?** → Ver [NETLIFY_TROUBLESHOOTING.md](./NETLIFY_TROUBLESHOOTING.md)  
**Guía completa?** → Ver [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md)  
**Comparar opciones?** → Ver [DEPLOYMENT_COMPARISON.md](./DEPLOYMENT_COMPARISON.md)
