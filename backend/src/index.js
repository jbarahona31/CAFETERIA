require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const pool = require('./config/database');

// Rutas
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const salesRoutes = require('./routes/salesRoutes');

const app = express();
const server = http.createServer(app);

// CORS: permitir origen desde FRONTEND_URL
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['*'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});
app.set('io', io);

// Middleware
app.set('trust proxy', 1);
app.use(express.json());

// Logging de solicitudes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rutas API
app.use('/api/productos', productRoutes);
app.use('/api/pedidos', orderRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/ventas', salesRoutes);

// Ruta decorativa /api
app.get('/api', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Bienvenido a la API de El Sabor Colombiano',
    endpoints: [
      '/api/productos',
      '/api/pedidos',
      '/api/usuarios',
      '/api/ventas',
      '/api/health',
      '/api/test-db'
    ]
  });
});

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'El Sabor Colombiano API is running' });
});

// Ruta de test de conexión a DB
app.get('/api/test-db', async (req, res) => {
  try {
    const timeResult = await pool.query('SELECT NOW()');
    const productsResult = await pool.query('SELECT COUNT(*) FROM productos');
    const usersResult = await pool.query('SELECT COUNT(*) FROM usuarios');
    const ordersResult = await pool.query('SELECT COUNT(*) FROM pedidos');

    res.json({
      time: timeResult.rows[0],
      stats: {
        products: parseInt(productsResult.rows[0].count),
        users: parseInt(usersResult.rows[0].count),
        orders: parseInt(ordersResult.rows[0].count)
      }
    });
  } catch (err) {
    console.error('[DB Error]', err);
    res.status(500).json({ error: 'Error conectando a la base de datos', details: err.message });
  }
});

// Eventos de Socket.IO
io.on('connection', (socket) => {
  console.log(`[Socket] Cliente conectado: ${socket.id}`);

  socket.on('join_meseros', () => {
    socket.join('meseros');
    console.log(`[Socket] ${socket.id} se unió a la sala meseros`);
  });

  socket.on('cambiar_estado', async (data) => {
    const { pedidoId, estado } = data;
    console.log(`[Socket] Solicitud cambiar_estado: pedido ${pedidoId} -> ${estado}`);
    // Nota: los cambios deben hacerse vía REST API
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Cliente desconectado: ${socket.id}`);
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Puerto
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║      🍽️  El Sabor Colombiano - API Server                ║
║                                                           ║
║   Server running on: http://localhost:${PORT}             ║
║   Socket.IO enabled for real-time updates                 ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = { app, server, io };
