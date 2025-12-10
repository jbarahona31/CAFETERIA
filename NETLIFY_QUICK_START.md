# 🚀 Despliegue Rápido en Netlify (5 minutos)

Esta guía te ayudará a desplegar el frontend en Netlify en menos de 5 minutos.

## Prerequisitos

✅ Cuenta en [Netlify](https://netlify.com) (gratuita)  
✅ Backend desplegado en Railway, Render, o similar  
✅ Repositorio en GitHub

## Paso 1: Conectar con Netlify (2 minutos)

### Opción A: Botón de Deploy (Más rápido)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/jbarahona31/CAFETERIA)

1. Haz clic en el botón "Deploy to Netlify"
2. Conecta tu cuenta de GitHub
3. Configura el repositorio
4. ¡Listo! Pasa al Paso 2

### Opción B: Manual

1. Ve a [app.netlify.com](https://app.netlify.com)
2. Clic en "Add new site" → "Import an existing project"
3. Selecciona "GitHub"
4. Autoriza Netlify en GitHub
5. Busca y selecciona el repo `jbarahona31/CAFETERIA`
6. Netlify detectará automáticamente la configuración

## Paso 2: Configurar Variables de Entorno (1 minuto)

En la página de configuración del sitio:

1. Ve a **Site settings** → **Environment variables**
2. Haz clic en **Add a variable**
3. Agrega estas dos variables:

```
Key: VITE_API_URL
Value: https://tu-backend.up.railway.app/api

Key: VITE_SOCKET_URL  
Value: https://tu-backend.up.railway.app
```

⚠️ **Importante**: Reemplaza `tu-backend.up.railway.app` con tu URL real del backend.

## Paso 3: Deploy (1 minuto)

1. Haz clic en **"Deploy site"**
2. Netlify construirá tu aplicación (toma ~1 minuto)
3. ¡Listo! Tu sitio estará en: `https://random-name-123.netlify.app`

## Paso 4: Actualizar Backend para CORS (1 minuto)

Tu backend debe permitir requests desde Netlify.

### En Railway:

1. Ve a tu servicio backend en Railway
2. Variables → Add Variable
3. Agrega o actualiza `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://tu-sitio.netlify.app
   ```
4. Redeploy el servicio

El backend ya tiene configurado CORS para usar esta variable.

## ✅ Verificación

1. **Frontend**: Visita `https://tu-sitio.netlify.app`
2. **Menú**: Deberías ver los productos
3. **Pedidos**: Crea un pedido de prueba
4. **WebSocket**: Las notificaciones en tiempo real deberían funcionar

## 🎨 Personalizar Dominio (Opcional)

1. En Netlify: **Site settings** → **Domain management**
2. Haz clic en **"Add custom domain"**
3. Sigue las instrucciones para configurar DNS
4. HTTPS se configura automáticamente

## 🔄 Deploy Automático

Cada vez que hagas `git push` a tu repo:
- ✅ Netlify desplegará automáticamente
- ✅ Recibirás un email con el resultado
- ✅ Los PRs tendrán preview automático

## 🆘 Problemas Comunes

### No veo los productos

**Causa**: Variables de entorno mal configuradas  
**Solución**:
1. Verifica `VITE_API_URL` en Netlify
2. Verifica que el backend esté corriendo
3. Abre la consola del navegador (F12) para ver errores

### Error CORS

**Causa**: Backend no permite requests desde Netlify  
**Solución**:
1. Actualiza `FRONTEND_URL` en Railway
2. Redeploy el backend
3. Verifica que la URL sea correcta (con https://)

### Rutas no funcionan (404)

**Causa**: Configuración de SPA  
**Solución**:
- El archivo `netlify.toml` ya maneja esto
- Si lo editaste, restaura el redirect: `/* /index.html 200`

### Build falla

**Causa**: Error en el código o dependencias  
**Solución**:
1. Ve a **Deploys** → Ver el log completo
2. Prueba localmente: `cd frontend && npm install && npm run build`
3. Revisa que todas las dependencias estén en `package.json`

## 📊 Monitoreo

En el dashboard de Netlify puedes ver:
- 📈 Número de deploys
- 🌍 Tráfico y bandwidth
- ⚡ Tiempo de build
- 📝 Logs de cada deploy

## 💡 Siguientes Pasos

- [ ] Configurar dominio personalizado
- [ ] Habilitar deploy previews para PRs
- [ ] Configurar notificaciones de deploy
- [ ] Optimizar imágenes y assets
- [ ] Configurar branch deploys para staging

## 📚 Recursos

- [Documentación completa de Netlify](./NETLIFY_DEPLOYMENT.md)
- [Docs oficiales de Netlify](https://docs.netlify.com/)
- [Soporte de Netlify](https://answers.netlify.com/)

---

¿Necesitas más ayuda? Ve a la [documentación completa](./NETLIFY_DEPLOYMENT.md) o abre un issue en GitHub.
