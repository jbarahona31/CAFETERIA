# El Sabor Colombiano - Sistema de Menú Digital

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

> El auténtico sabor de nuestra tierra 🇨🇴

Sistema completo de menú digital para cafetería con gestión de pedidos en tiempo real, desarrollado con Node.js, Express, Socket.IO, React y PostgreSQL.

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
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL
```

### 4. Instalar dependencias del Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
# Editar .env si es necesario
```

### 5. Agregar archivos de sonido

Coloca los siguientes archivos de audio en `frontend/public/sounds/`:
- `new-order.mp3` - Sonido de campana para nuevos pedidos
- `order-ready.mp3` - Sonido de timbre para pedidos listos

## ⚙️ Configuración

### Backend (.env)

```env
# PostgreSQL Database Configuration
PGUSER=postgres
PGHOST=localhost
PGDATABASE=elsaborcolombiano
PGPASSWORD=tu_contraseña
PGPORT=5432

# Server Configuration
PORT=4000

# JWT Configuration
JWT_SECRET=tu_clave_secreta
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

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/usuarios` | Lista todos los usuarios |
| GET | `/api/usuarios/:id` | Obtiene un usuario por ID |
| POST | `/api/usuarios` | Crea un nuevo usuario |
| PUT | `/api/usuarios/:id` | Actualiza un usuario |
| DELETE | `/api/usuarios/:id` | Elimina un usuario |
| POST | `/api/usuarios/login` | Autenticación de usuario |

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

#### Ejemplo de creación de usuario:

```json
POST /api/usuarios
{
  "nombre": "Juan Mesero",
  "email": "juan@cafeteria.com",
  "contrasena": "miPassword123",
  "rol": "mesero"
}
```

#### Ejemplo de login:

```json
POST /api/usuarios/login
{
  "email": "juan@cafeteria.com",
  "contrasena": "miPassword123"
}
```

#### Estados válidos de pedido:
- `pendiente` → `preparacion` → `listo` → `entregado`
- `cancelado` (desde cualquier estado)

#### Roles de usuario:
- `admin` - Administrador del sistema
- `mesero` - Personal de servicio
- `cocina` - Personal de cocina

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

### Backend (Recomendado: Railway, Render, VPS)

```bash
# Con PM2
npm install -g pm2
pm2 start src/index.js --name "el-sabor-api"
```

### Frontend (Recomendado: Vercel, Netlify)

```bash
npm run build
# Subir carpeta dist/ al hosting
```

### Base de datos (Recomendado: Supabase, Railway, Neon, RDS)

Actualizar variables de entorno con credenciales del servicio de PostgreSQL gestionado.

## 📝 Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles.

---

Desarrollado con ❤️ para El Sabor Colombiano