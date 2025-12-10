# Guía de Despliegue en Railway

## Pasos para Desplegar en Railway

### 1. Configurar PostgreSQL en Railway

1. En tu proyecto de Railway, agrega una nueva base de datos PostgreSQL
2. Railway creará automáticamente la variable `DATABASE_URL`

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
- `npm install` (instala dependencias del backend)
- `npm install --prefix frontend` (instala dependencias del frontend)
- `npm run build` (construye el frontend)
- `npm run start` (inicia el servidor backend que sirve el frontend)

### 4. Poblar la Base de Datos (Seed)

Después del primer despliegue, necesitas poblar la base de datos con productos y usuarios iniciales.

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

## Solución de Problemas

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
