# El Sabor Colombiano - Sistema de Menú Digital

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

> El auténtico sabor de nuestra tierra 🇨🇴

Sistema completo de menú digital para cafetería con gestión de pedidos en tiempo real, desarrollado con Node.js, Express, Socket.IO, React y MySQL.

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
- 💾 Persistencia en MySQL
- 📦 Cálculo automático de totales

## 🛠 Tecnologías

### Backend
- Node.js
- Express.js
- Socket.IO
- MySQL2

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
│   │   │   └── productController.js
│   │   ├── routes/
│   │   │   ├── orderRoutes.js
│   │   │   └── productRoutes.js
│   │   ├── services/
│   │   │   ├── orderService.js
│   │   │   └── productService.js
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
│   ├── schema.sql
│   └── seed.sql
└── README.md
```

## 📋 Requisitos Previos

- Node.js 18+ y npm
- MySQL 8.0+

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/el-sabor-colombiano.git
cd el-sabor-colombiano
```

### 2. Configurar la base de datos

```bash
# Conectar a MySQL y ejecutar los scripts
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### 3. Instalar dependencias del Backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales de base de datos
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
DB_HOST=localhost
DB_USER=root
DB_PASS=tu_contraseña
DB_NAME=el_sabor_colombiano
PORT=3001
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
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

El backend estará en `http://localhost:3001` y el frontend en `http://localhost:5173`

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

#### Estados válidos de pedido:
- `pendiente` → `preparacion` → `listo` → `entregado`
- `cancelado` (desde cualquier estado)

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

### Tablas

**productos**
- id, nombre, categoria (comida/bebida), descripcion, precio, stock, promocion, imagen_url

**pedidos**
- id, cliente, estado, total, created_at

**detalle_pedido**
- id, pedido_id, producto_id, cantidad, precio_unitario, subtotal

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

### Base de datos (Recomendado: PlanetScale, Railway, RDS)

Actualizar variables de entorno con credenciales del servicio de base de datos gestionado.

## 📝 Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles.

---

Desarrollado con ❤️ para El Sabor Colombiano