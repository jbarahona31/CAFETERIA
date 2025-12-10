# Guía de Despliegue en Railway

> 🚀 **¿Primera vez?** Ver [RAILWAY_QUICK_START.md](./RAILWAY_QUICK_START.md) para una guía rápida de 5 minutos

## Pasos para Desplegar en Railway

### 1. Configurar PostgreSQL en Railway

1. En tu proyecto de Railway, agrega una nueva base de datos PostgreSQL desde el catálogo
   - Selecciona "New" → "Database" → "Add PostgreSQL"
2. Railway creará automáticamente las siguientes variables:
   - `DATABASE_URL` (URL completa de conexión)
   - `POSTGRES_PASSWORD` (contraseña generada)
   - Y otras variables de conexión

📖 **Ver guía detallada**: [RAILWAY_DATABASE_SETUP.md](./RAILWAY_DATABASE_SETUP.md)

### 2. Configurar Variables de Entorno

En la configuración de tu servicio en Railway, asegúrate de tener estas variables:

```
DATABASE_URL=<generado automáticamente por Railway>
NODE_ENV=production
JWT_SECRET=<tu_jwt_secret_seguro>
PORT=4000
```

### 3. Desplegar la Aplicación

Railway detectará automáticamente el `railway.json` y ejecutará:
- **Build**: `npm install && npm install --prefix backend && npm install --prefix frontend && npm run build`
- **Deploy**: `cd backend && npm run init-db && npm start`
  - Inicializa la base de datos (crea tablas e inserta datos iniciales)
  - Inicia el servidor backend que sirve el frontend

### 4. Poblar la Base de Datos (Automático)

✨ **NUEVO**: La base de datos se inicializa automáticamente en el primer despliegue.

El script de inicialización (`init-railway-db.js`) se ejecuta automáticamente y:
- Crea todas las tablas necesarias
- Inserta 14 productos iniciales (si la tabla está vacía)
- Crea 2 usuarios por defecto (si la tabla está vacía)
- Muestra un resumen en los logs

**Para verificar que funcionó:**
1. Ve a Railway → Tu servicio → Deployments → View Logs
2. Busca mensajes como: "✅ Base de datos inicializada correctamente"

**Inicialización manual** (solo si es necesario):

#### Opción A: Usar Railway CLI

```bash
# Instala Railway CLI si no lo tienes
npm i -g @railway/cli

# Login
railway login

# Link al proyecto
railway link

# Ejecutar seed
railway run npm run seed
```

#### Opción B: Conectar a la Base de Datos Manualmente

1. En Railway, ve a tu servicio PostgreSQL
2. Copia las credenciales de conexión (Variables > Connect)
3. Usa un cliente PostgreSQL (como psql o pgAdmin) para conectarte
4. Ejecuta los scripts SQL en este orden:
   - `database/schema.sql` (si las tablas no existen)
   - `database/seed.sql` (para insertar datos iniciales)

#### Opción C: Desde tu máquina local

```bash
# Configura las variables de entorno de Railway en .env
# Luego ejecuta:
cd backend
npm run check-seed
```

### 5. Verificar el Despliegue

Una vez desplegado, verifica que todo funcione:

1. **Verificar API**: 
   - Visita `https://tu-app.up.railway.app/api/health`
   - Debería responder: `{"status":"ok","message":"El Sabor Colombiano API is running"}`

2. **Verificar Base de Datos**:
   - Visita `https://tu-app.up.railway.app/api/test-db`
   - Debería mostrar la hora actual y estadísticas de la base de datos
   - Si `stats.products` es 0, necesitas ejecutar el seed

3. **Verificar Frontend**:
   - Visita `https://tu-app.up.railway.app`
   - Deberías ver el menú con productos

## Configuración de Producción

### Trust Proxy

La aplicación está configurada con `trust proxy` habilitado para funcionar correctamente detrás del proxy reverso de Railway. Esto permite que:

- `express-rate-limit` identifique correctamente las IPs de los clientes a través del header `X-Forwarded-For`
- Los límites de tasa (rate limiting) funcionen correctamente en login y registro
- Se prevengan ataques de fuerza bruta efectivamente

**Configuración**: `app.set('trust proxy', 1)` en `backend/src/index.js`

## Solución de Problemas

### Error de Rate Limiting (X-Forwarded-For)

Si ves el error `ERR_ERL_UNEXPECTED_X_FORWARDED_FOR`:
- Asegúrate de que `trust proxy` esté habilitado en Express (ya configurado)
- Este error ocurre cuando Railway envía headers de proxy pero Express no está configurado para confiar en ellos

### Los productos no aparecen

1. **Verifica que el seed se haya ejecutado**:
   - Visita `/api/test-db` para ver las estadísticas
   - Si `products: 0`, ejecuta el seed (ver paso 4)

2. **Verifica la URL del API**:
   - El frontend construido debe usar la URL correcta del backend
   - Asegúrate de que `frontend/.env.production` tenga el `VITE_API_URL` correcto

3. **Revisa los logs**:
   - En Railway, ve a tu servicio > Deployments > [último deployment] > View Logs
   - Busca errores de conexión a la base de datos

### El logo no aparece

1. **Verifica que la imagen exista**:
   - Debe estar en `frontend/public/img/LOGO.jpeg`

2. **Verifica el build**:
   - Después de `npm run build`, verifica que la imagen esté en `frontend/dist/img/`

### Error de conexión CORS

1. Asegúrate de que `FRONTEND_URL` esté configurado en las variables de entorno
2. El valor debe ser la URL de tu aplicación en Railway

## Usuarios Iniciales (Después del Seed)

- **Admin**: admin@elsaborcolombiano.com / admin123
- **Mesero**: mesero@elsaborcolombiano.com / mesero123

⚠️ **Importante**: Cambia estas contraseñas después del primer login en producción.
