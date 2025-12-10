# El Sabor Colombiano - Sistema de Menú Digital

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-SITE-ID/deploy-status)](https://app.netlify.com/sites/YOUR-SITE-NAME/deploys)

> El auténtico sabor de nuestra tierra 🇨🇴

Sistema completo de menú digital para cafetería con gestión de pedidos en tiempo real, desarrollado con Node.js, Express, Socket.IO, React y PostgreSQL.

## 🚀 Deploy Rápido en Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/jbarahona31/CAFETERIA)

📖 **[Documentación completa de Netlify](./NETLIFY_INDEX.md)** | ⚡ **[Quick Start (5 min)](./NETLIFY_QUICK_START.md)**

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [API Endpoints](#-api-endpoints)
- [Eventos Socket.IO](#-eventos-socketio)
- [Base de Datos](#-base-de-datos)
- [Branding](#-branding)
- [Despliegue](#-despliegue)

## ✨ Características

### Para Clientes
- 📱 Menú digital responsivo
- 🛒 Carrito de compras con persistencia local
- 🔔 Notificaciones en tiempo real cuando el pedido está listo
- 🔥 Visualización de promociones
- ✅ Verificación de disponibilidad de productos

### Para Meseros
- 👨‍🍳 Panel de gestión de pedidos
- 🔄 Actualización de estados en tiempo real
- 🔔 Alertas sonoras para nuevos pedidos
- 📊 Filtrado por estado de pedidos

### Características Técnicas
- 🚀 Comunicación en tiempo real con Socket.IO
- 🔒 Validación de stock antes de crear pedidos
- 🔐 Autenticación con bcrypt para contraseñas
- 💾 Persistencia en PostgreSQL
- 📦 Cálculo automático de totales

## 🛠 Tecnologías

### Backend
- Node.js
- Express.js
- Socket.IO
- PostgreSQL (pg - node-postgres)
- bcrypt

### Frontend
- React 18
- Vite
- React Router DOM
- Socket.IO Client
- React Hot Toast

## 📁 Estructura del Proyecto

```
el-sabor-colombiano/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── orderController.js
│   │   │   ├── productController.js
│   │   │   └── userController.js
│   │   ├── routes/
│   │   │   ├── orderRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── services/
│   │   │   ├── orderService.js
│   │   │   ├── productService.js
│   │   │   └── userService.js
│   │   ├── scripts/
│   │   │   └── seed.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   │   ├── sounds/
│   │   │   ├── new-order.mp3
│   │   │   └── order-ready.mp3
│   │   └── logo.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Header.css
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProductCard.css
│   │   ├── context/
│   │   │   └── CartContext.jsx
│   │   ├── hooks/
│   │   │   └── useSound.js
│   │   ├── pages/
│   │   │   ├── Menu.jsx
│   │   │   ├── Menu.css
│   │   │   ├── Cart.jsx
│   │   │   ├── Cart.css
│   │   │   ├── WaiterPanel.jsx
│   │   │   └── WaiterPanel.css
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── database/
│   ├── init.sql
│   ├── schema.sql
│   └── seed.sql
└── README.md
```

## 📋 Requisitos Previos

- Node.js 18+ y npm
- PostgreSQL 14+

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/el-sabor-colombiano.git
cd el-sabor-colombiano
```

### 2. Configurar la base de datos PostgreSQL

```bash
# Crear la base de datos
createdb el_sabor_colombiano

# Ejecutar el script de inicialización (schema + seed)
psql -d el_sabor_colombiano -f database/init.sql

# O ejecutar los scripts por separado
psql -d el_sabor_colombiano -f database/schema.sql
psql -d el_sabor_colombiano -f database/seed.sql
```

### 3. Instalar dependencias del Backend

```bash
cd backend
npm install
# Editar .env con tus credenciales de PostgreSQL (archivo incluido en el repositorio)
```

### 4. Instalar dependencias del Frontend

```bash
cd ../frontend
npm install
# Editar .env si es necesario (archivo incluido en el repositorio)
```

### 5. Agregar archivos de sonido

Coloca los siguientes archivos de audio en `frontend/public/sounds/`:
- `new-order.mp3` - Sonido de campana para nuevos pedidos
- `order-ready.mp3` - Sonido de timbre para pedidos listos

## ⚙️ Configuración

### Backend (.env)

> ⚠️ **Importante:** Los archivos `.env` incluidos contienen valores de ejemplo. Asegúrate de cambiar `PGPASSWORD` y `JWT_SECRET` con valores seguros antes de usar en producción.

```env
# PostgreSQL Database Configuration
PGUSER=postgres
PGHOST=localhost
PGDATABASE=elsaborcolombiano
PGPASSWORD=CHANGE_ME_YOUR_PASSWORD
PGPORT=5432

# Server Configuration
PORT=4000

# JWT Configuration
JWT_SECRET=CHANGE_ME_YOUR_JWT_SECRET
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

## 🏃 Ejecución

### Desarrollo

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

El backend estará en `http://localhost:4000` y el frontend en `http://localhost:5173`

### Producción

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📡 API Endpoints

### Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos` | Lista todos los productos con stock y promociones |
| PUT | `/api/productos/:id` | Actualiza un producto (nombre, descripción, precio, stock, promoción) |

### Pedidos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/pedidos` | Crea un nuevo pedido |
| GET | `/api/pedidos` | Lista pedidos (opcional: `?estado=pendiente`) |
| PUT | `/api/pedidos/:id/estado` | Actualiza el estado de un pedido |

### Usuarios

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/api/usuarios/register` | Registra un nuevo usuario (cliente) | No |
| POST | `/api/usuarios/login` | Autenticación de usuario | No |
| GET | `/api/usuarios` | Lista todos los usuarios | Admin |
| GET | `/api/usuarios/:id` | Obtiene un usuario por ID | JWT |
| POST | `/api/usuarios` | Crea un nuevo usuario con rol | Admin |
| PUT | `/api/usuarios/:id` | Actualiza un usuario | Admin |
| DELETE | `/api/usuarios/:id` | Elimina un usuario | Admin |

#### Ejemplo de registro de usuario:

```json
POST /api/usuarios/register
{
  "nombre": "Juan Cliente",
  "email": "juan@ejemplo.com",
  "contrasena": "miPassword123"
}
```

**Respuesta:**
```json
{
  "mensaje": "Usuario registrado exitosamente",
  "usuario": {
    "id": 1,
    "nombre": "Juan Cliente",
    "email": "juan@ejemplo.com",
    "rol": "cliente",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Ejemplo de login:

```json
POST /api/usuarios/login
{
  "email": "juan@ejemplo.com",
  "contrasena": "miPassword123"
}
```

**Respuesta:**
```json
{
  "mensaje": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nombre": "Juan Cliente",
    "email": "juan@ejemplo.com",
    "rol": "cliente",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Uso del Token JWT

Para acceder a rutas protegidas, incluye el token en el header de la petición:

```
Authorization: Bearer <token>
```

#### Ejemplo de creación de pedido:

```json
POST /api/pedidos
{
  "cliente": "Juan Pérez",
  "items": [
    { "productoId": 1, "cantidad": 2 },
    { "productoId": 7, "cantidad": 1 }
  ]
}
```

#### Ejemplo de creación de usuario (Admin):

```json
POST /api/usuarios
{
  "nombre": "Juan Mesero",
  "email": "juan@cafeteria.com",
  "contrasena": "miPassword123",
  "rol": "mesero"
}
```

#### Estados válidos de pedido:
- `pendiente` → `preparacion` → `listo` → `entregado`
- `cancelado` (desde cualquier estado)

#### Roles de usuario:
- `admin` - Administrador del sistema (gestión de productos y usuarios)
- `mesero` - Personal de servicio (panel de pedidos)
- `cocina` - Personal de cocina
- `cliente` - Clientes (menú y pedidos)

#### Usuarios iniciales (seed):
- **Admin:** admin@elsaborcolombiano.com / admin123
- **Mesero:** mesero@elsaborcolombiano.com / mesero123

> ⚠️ **Importante:** Cambiar estas contraseñas en producción.

## 🔌 Eventos Socket.IO

### Servidor → Cliente

| Evento | Descripción | Datos |
|--------|-------------|-------|
| `nuevo_pedido` | Nuevo pedido creado | `{pedidoId, cliente, items, total}` |
| `pedido_actualizado` | Estado de pedido cambiado | `{pedidoId, estado}` |
| `pedido_listo` | Pedido listo para entrega | `{pedidoId, mensaje}` |

### Cliente → Servidor

| Evento | Descripción | Datos |
|--------|-------------|-------|
| `join_meseros` | Unirse a sala de meseros | - |
| `cambiar_estado` | Solicitar cambio de estado | `{pedidoId, estado}` |

## 🗃️ Base de Datos

### PostgreSQL

Este proyecto utiliza **PostgreSQL** como base de datos. Las características principales incluyen:

- **SERIAL** para campos auto-incrementales
- **BOOLEAN** para valores booleanos
- **NUMERIC(10,2)** para valores decimales
- **TIMESTAMP DEFAULT CURRENT_TIMESTAMP** para fechas automáticas
- **Foreign Keys** con ON DELETE CASCADE

### Tablas

**productos**
```sql
id SERIAL PRIMARY KEY
nombre VARCHAR(120)
categoria VARCHAR(20)
descripcion TEXT
precio NUMERIC(10,2)
stock INT
promocion BOOLEAN
imagen_url TEXT
```

**pedidos**
```sql
id SERIAL PRIMARY KEY
cliente VARCHAR(120)
estado VARCHAR(20)
total NUMERIC(10,2)
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

**detalle_pedido**
```sql
id SERIAL PRIMARY KEY
pedido_id INT REFERENCES pedidos(id) ON DELETE CASCADE
producto_id INT REFERENCES productos(id)
cantidad INT
precio_unitario NUMERIC(10,2)
subtotal NUMERIC(10,2)
```

**usuarios**
```sql
id SERIAL PRIMARY KEY
nombre VARCHAR(100)
email VARCHAR(120) UNIQUE
contrasena_hash VARCHAR(255)
rol VARCHAR(20)
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Seed de datos

El script incluye 14 productos iniciales:
- 6 comidas (papas rellenas, empanadas, arepas)
- 8 bebidas (avena, jugos, café, chocolate)

Para ejecutar el seed:
```bash
cd backend
npm run seed
```

## 🎨 Branding

### Colores

| Color | Código | Uso |
|-------|--------|-----|
| Primario | `#4A2C2A` | Headers, botones principales |
| Secundario | `#FFC107` | Acentos, promociones |
| Accento | `#8BC34A` | Botones de acción, disponibilidad |

### Tipografías

- **Títulos:** Playfair Display, Merriweather
- **Cuerpo:** Inter, Roboto

## 🚀 Despliegue

### Despliegue en Netlify + Railway (Recomendado)

Este proyecto utiliza una arquitectura dividida para el despliegue:
- **Frontend en Netlify**: Rápido, CDN global, deploy automático
- **Backend en Railway**: Soporta WebSockets/Socket.IO para notificaciones en tiempo real

🌐 **Despliegue en Netlify**: Ver [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) para la guía completa

### Despliegue en Railway (Fullstack)

También puedes desplegar frontend y backend juntos en Railway.

🚀 **Inicio Rápido**: Ver [RAILWAY_QUICK_START.md](./RAILWAY_QUICK_START.md) para desplegar en 5 minutos

#### 1. Crear cuenta y proyecto en Railway

1. Ve a [Railway.app](https://railway.app) y crea una cuenta
2. Crea un nuevo proyecto desde tu repositorio de GitHub
3. Railway detectará automáticamente la configuración del proyecto

#### 2. Agregar base de datos PostgreSQL

1. En tu proyecto de Railway, haz clic en "New" → "Database" → "Add PostgreSQL"
2. Railway creará automáticamente las variables de conexión
3. La base de datos se inicializará automáticamente en el primer despliegue

📖 **Documentación completa**: Ver [RAILWAY_DATABASE_SETUP.md](./RAILWAY_DATABASE_SETUP.md)

#### 3. Configurar variables de entorno

En la configuración del servicio en Railway, agrega las siguientes variables:

```env
# Base de datos (Railway las proporciona automáticamente al agregar PostgreSQL)
DB_HOST=containers.railway.app
DB_NAME=railway
DB_PASSWORD=<tu_password_de_railway>
DB_PORT=5432
DB_USER=railway

# Configuración del servidor
NODE_ENV=production

# JWT (usa un valor seguro)
JWT_SECRET=<tu_jwt_secret_seguro>

# URL del frontend (para CORS) - Reemplaza con tu URL de Railway
FRONTEND_URL=https://<tu-proyecto>.up.railway.app
```

#### 4. Despliegue automático

Railway desplegará automáticamente cada vez que hagas `git push` a tu repositorio.

El proyecto está configurado con `railway.json` para:
- Instalar dependencias del proyecto completo
- Compilar el frontend con `npm run build`
- **Inicializar la base de datos automáticamente** (esquema + datos iniciales)
- Servir el frontend estático desde el backend en producción

✨ **Nota**: En el primer despliegue, el script creará automáticamente:
- Todas las tablas necesarias (productos, pedidos, usuarios, etc.)
- 14 productos iniciales
- 2 usuarios por defecto (admin y mesero)

#### URLs de producción

Reemplaza `<tu-proyecto>` con el nombre de tu proyecto en Railway:

- **API:** `https://<tu-proyecto>.up.railway.app/api`
- **Frontend:** `https://<tu-proyecto>.up.railway.app`
- **Socket.IO:** `https://<tu-proyecto>.up.railway.app`

### Opciones de Despliegue Alternativas

#### Opción 1: Netlify (Frontend) + Railway (Backend)
- **Frontend**: Deploy automático en Netlify con CDN global
- **Backend**: Railway con PostgreSQL y Socket.IO
- Ver [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md)

#### Opción 2: Railway (Fullstack)
- Frontend y backend juntos en Railway
- Ver [RAILWAY_QUICK_START.md](./RAILWAY_QUICK_START.md)

#### Opción 3: Netlify + Render
- **Frontend**: Netlify
- **Backend**: Render (alternativa a Railway)
- Render soporta WebSockets y tiene plan gratuito

#### Opción 4: Vercel + Railway
- **Frontend**: Vercel (similar a Netlify)
- **Backend**: Railway

### Componentes Individuales

#### Backend (Render, VPS, DigitalOcean)

```bash
# Con PM2
npm install -g pm2
pm2 start src/index.js --name "el-sabor-api"
```

#### Frontend (Netlify, Vercel, CloudFlare Pages)

```bash
cd frontend
npm run build
# La carpeta dist/ contiene los archivos estáticos
```

### Base de datos (Supabase, Railway, Neon, RDS)

Actualizar variables de entorno con credenciales del servicio de PostgreSQL gestionado.

## 📝 Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles.

---

Desarrollado con ❤️ para El Sabor Colombiano