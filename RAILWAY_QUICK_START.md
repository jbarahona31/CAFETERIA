# Railway Quick Start Guide

## 🚀 Despliegue Rápido en Railway

Esta guía te ayudará a desplegar "El Sabor Colombiano" en Railway en menos de 5 minutos.

### Prerrequisitos
- ✅ Cuenta de GitHub
- ✅ Cuenta de Railway ([railway.app](https://railway.app))
- ✅ Código en un repositorio de GitHub

---

## Paso 1: Crear Proyecto en Railway

1. Ve a [railway.app](https://railway.app) e inicia sesión con GitHub
2. Haz clic en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Elige el repositorio `jbarahona31/CAFETERIA`
5. Railway comenzará a configurar el proyecto

---

## Paso 2: Agregar PostgreSQL

1. En tu proyecto, haz clic en **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway creará automáticamente:
   - Base de datos PostgreSQL
   - Variables de conexión (`DATABASE_URL`, `POSTGRES_PASSWORD`, etc.)
3. Espera a que la base de datos esté lista (ícono verde)

---

## Paso 3: Configurar Variables de Entorno

En el servicio de la aplicación (no en PostgreSQL):

1. Ve a **"Variables"** tab
2. Agrega estas variables:

```
NODE_ENV=production
JWT_SECRET=tu_secreto_jwt_super_seguro_aqui_32_caracteres_minimo
```

**Nota**: Railway ya configuró automáticamente `DATABASE_URL` al agregar PostgreSQL.

---

## Paso 4: Desplegar

1. Railway desplegará automáticamente al detectar el repositorio
2. O haz clic en **"Deploy"** si es necesario
3. Espera a que termine el despliegue (2-3 minutos)

**Durante el despliegue, el sistema automáticamente:**
- ✅ Instala dependencias (backend y frontend)
- ✅ Compila el frontend
- ✅ **Inicializa la base de datos** (crea tablas e inserta datos)
- ✅ Inicia el servidor

---

## Paso 5: Verificar

Una vez desplegado, Railway te dará una URL: `https://tu-proyecto.up.railway.app`

### Verificar que todo funciona:

1. **Frontend**: Visita `https://tu-proyecto.up.railway.app`
   - Deberías ver el menú con productos

2. **API Health**: Visita `https://tu-proyecto.up.railway.app/api/test-db`
   - Deberías ver: `{ "status": "ok", "stats": { "products": 14, "users": 2, ... } }`

3. **Panel de Meseros**: Visita `https://tu-proyecto.up.railway.app/meseros`
   - Credenciales: `mesero@elsaborcolombiano.com` / `mesero123`

---

## Paso 6: 🔒 Seguridad - Cambiar Contraseñas

⚠️ **IMPORTANTE**: Cambia las contraseñas por defecto INMEDIATAMENTE.

### Usuarios por defecto:
- **Admin**: admin@elsaborcolombiano.com / admin123
- **Mesero**: mesero@elsaborcolombiano.com / mesero123

### Cómo cambiar contraseñas:

1. **Inicia sesión** con el usuario admin:
```bash
curl -X POST https://tu-proyecto.up.railway.app/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@elsaborcolombiano.com","contrasena":"admin123"}'
```

2. **Guarda el token** de la respuesta

3. **Cambia la contraseña**:
```bash
curl -X PUT https://tu-proyecto.up.railway.app/api/usuarios/1 \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"contrasena":"Nueva_Contraseña_Segura_2024!"}'
```

4. **Repite para el mesero** (usuario ID 2)

---

## Variables de Entorno Completas

Copia esto en la sección de Variables de Railway:

```bash
# Base de datos (Railway las crea automáticamente al agregar PostgreSQL)
DATABASE_URL=<auto-generada>
POSTGRES_PASSWORD=<auto-generada>

# Aplicación
NODE_ENV=production
JWT_SECRET=tu_secreto_jwt_super_seguro_aqui_32_caracteres_minimo

# Opcional: Para configurar CORS específicamente
FRONTEND_URL=https://tu-proyecto.up.railway.app
```

---

## Estructura de Datos Inicial

Después del primer despliegue, tendrás:

### 📦 14 Productos
- 6 comidas (papas rellenas, empanadas, arepas)
- 8 bebidas (avena, jugos, café, chocolate)

### 👥 2 Usuarios
- Administrador (gestión completa)
- Mesero (panel de pedidos)

### 📊 Tablas
- `productos` - Catálogo de menú
- `pedidos` - Órdenes de clientes
- `detalle_pedido` - Items de cada orden
- `usuarios` - Usuarios del sistema

---

## Comandos Útiles (Railway CLI)

Instala Railway CLI:
```bash
npm i -g @railway/cli
railway login
railway link
```

Comandos útiles:
```bash
# Ver logs en tiempo real
railway logs

# Ejecutar comandos en el servidor
railway run npm run verify-db

# Reinicializar la base de datos
railway run npm run seed

# Verificar estado de la base de datos
railway run npm run verify-db
```

---

## Solución de Problemas

### ❌ No aparecen productos en el frontend

**Solución**:
1. Verifica: `https://tu-proyecto.up.railway.app/api/test-db`
2. Si `products: 0`, ejecuta: `railway run npm run init-db`
3. Revisa los logs: `railway logs`

### ❌ Error de conexión a la base de datos

**Solución**:
1. Verifica que PostgreSQL esté en estado "Active" (verde)
2. Verifica que `DATABASE_URL` esté configurada
3. Reinicia el servicio de la aplicación

### ❌ Error 502 Bad Gateway

**Solución**:
1. Espera 1-2 minutos (la app puede estar iniciando)
2. Revisa los logs: `railway logs`
3. Verifica que el puerto esté bien configurado (Railway lo hace automáticamente)

---

## Redeployment

Para redesplegar:
1. Haz `git push` a tu repositorio
2. Railway detecta cambios automáticamente
3. Redespliegue automático en 2-3 minutos

O manualmente:
1. Ve a Railway → Tu proyecto → "Deployments"
2. Haz clic en **"Deploy"** → **"Redeploy"**

---

## Próximos Pasos

✅ Despliegue completado  
✅ Base de datos inicializada  
⚠️ **Pendiente**: Cambiar contraseñas por defecto  

**Luego puedes:**
- Personalizar productos en la base de datos
- Agregar más usuarios desde el panel de admin
- Configurar un dominio personalizado en Railway
- Configurar respaldos automáticos

---

## Documentación Adicional

- 📖 [Guía Completa de Base de Datos](./RAILWAY_DATABASE_SETUP.md)
- 📖 [Guía de Despliegue Detallada](./DEPLOYMENT.md)
- 📖 [README Principal](./README.md)

---

## ¿Necesitas Ayuda?

1. **Logs de Railway**: La primera parada para debugging
2. **Endpoint de salud**: `/api/test-db` para verificar estado
3. **Script de verificación**: `railway run npm run verify-db`
4. **Documentación de Railway**: [docs.railway.app](https://docs.railway.app)

---

**¡Listo!** Tu aplicación "El Sabor Colombiano" está en línea. 🎉🇨🇴
