require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

// Importar conexión a la base de datos
const pool = require('./config/database');

// Importar rutas
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Store io in app for access in controllers
app.set('io', io);

// Trust proxy - Required for Railway and other reverse proxies
// This allows express-rate-limit to correctly identify client IPs
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from frontend dist folder in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/productos', productRoutes);
app.use('/api/pedidos', orderRoutes);
app.use('/api/usuarios', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'El Sabor Colombiano API is running' });
});

// Test DB connection and show stats
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

// Socket.IO events
io.on('connection', (socket) => {
  console.log(`[Socket] Cliente conectado: ${socket.id}`);

  // Meseros join their room
  socket.on('join_meseros', () => {
    socket.join('meseros');
    console.log(`[Socket] ${socket.id} se unió a la sala meseros`);
  });

  // Listen for status change requests from meseros
  socket.on('cambiar_estado', async (data) => {
    const { pedidoId, estado } = data;
    console.log(`[Socket] Solicitud cambiar_estado: pedido ${pedidoId} -> ${estado}`);
    // Nota: Los cambios de estado deben hacerse vía REST API para consistencia
    // Este evento es solo para actualizaciones en tiempo real
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Cliente desconectado: ${socket.id}`);
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Catch-all route for SPA (must be after API routes)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, '../dist/index.html');
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('[Error] Failed to serve index.html:', err);
        res.status(500).send('Error loading application');
      }
    });
  });
}

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
