require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

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

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/productos', productRoutes);
app.use('/api/pedidos', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'El Sabor Colombiano API is running' });
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
    // Note: Status changes should be done through the REST API for consistency
    // This event is for real-time updates only
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

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║      🍽️  El Sabor Colombiano - API Server                 ║
║                                                           ║
║   Server running on: http://localhost:${PORT}               ║
║   Socket.IO enabled for real-time updates                 ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = { app, server, io };
