const pool = require('../config/database');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const SALT_ROUNDS = 10;

// Database schema
const schema = `
-- El Sabor Colombiano - PostgreSQL Database Schema

-- Tabla productos
CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  categoria VARCHAR(20) NOT NULL,
  descripcion TEXT,
  precio NUMERIC(10,2) NOT NULL,
  stock INT DEFAULT 0,
  promocion BOOLEAN DEFAULT FALSE,
  imagen_url TEXT
);

-- Tabla pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  cliente VARCHAR(120),
  estado VARCHAR(20) DEFAULT 'pendiente',
  total NUMERIC(10,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla detalle_pedido
CREATE TABLE IF NOT EXISTS detalle_pedido (
  id SERIAL PRIMARY KEY,
  pedido_id INT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id INT NOT NULL REFERENCES productos(id),
  cantidad INT NOT NULL,
  precio_unitario NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL
);

-- Tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  contrasena_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(20) DEFAULT 'mesero',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_promocion ON productos(promocion);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_detalle_pedido_pedido ON detalle_pedido(pedido_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
`;

const seedProducts = [
  { nombre: 'Papas rellenas', categoria: 'comida', descripcion: 'Crujientes y doradas, con relleno casero', precio: 4500, stock: 20, promocion: false, imagen_url: '/img/papas.jpg' },
  { nombre: 'Empanada de pollo', categoria: 'comida', descripcion: 'Pollo desmechado con especias', precio: 2000, stock: 50, promocion: true, imagen_url: '/img/emp_pollo.jpg' },
  { nombre: 'Empanada de carne', categoria: 'comida', descripcion: 'Carne sazonada, masa crocante', precio: 2000, stock: 50, promocion: false, imagen_url: '/img/emp_carne.jpg' },
  { nombre: 'Empanada ranchera', categoria: 'comida', descripcion: 'Sabor picantico, estilo ranchero', precio: 2200, stock: 40, promocion: false, imagen_url: '/img/emp_ranchera.jpg' },
  { nombre: 'Arepa de carne', categoria: 'comida', descripcion: 'Arepa rellena con carne', precio: 5000, stock: 25, promocion: false, imagen_url: '/img/arepa_carne.jpg' },
  { nombre: 'Arepa de queso', categoria: 'comida', descripcion: 'Queso derretido, masa suave', precio: 4500, stock: 30, promocion: true, imagen_url: '/img/arepa_queso.jpg' },
  { nombre: 'Avena', categoria: 'bebida', descripcion: 'Refrescante y cremosa', precio: 3000, stock: 40, promocion: false, imagen_url: '/img/avena.jpg' },
  { nombre: 'Jugo de mora', categoria: 'bebida', descripcion: 'Natural y fresco', precio: 3500, stock: 30, promocion: false, imagen_url: '/img/jugo_mora.jpg' },
  { nombre: 'Jugo de guanábana', categoria: 'bebida', descripcion: 'Dulce y cremoso', precio: 4000, stock: 25, promocion: false, imagen_url: '/img/jugo_guanabana.jpg' },
  { nombre: 'Jugo de tomate de árbol', categoria: 'bebida', descripcion: 'Ácido y energético', precio: 3500, stock: 25, promocion: false, imagen_url: '/img/jugo_tomate.jpg' },
  { nombre: 'Jugo de guayaba', categoria: 'bebida', descripcion: 'Aromático y suave', precio: 3500, stock: 25, promocion: true, imagen_url: '/img/jugo_guayaba.jpg' },
  { nombre: 'Café', categoria: 'bebida', descripcion: 'Tostión media, sabor tradicional', precio: 2500, stock: 60, promocion: false, imagen_url: '/img/cafe.jpg' },
  { nombre: 'Café con leche', categoria: 'bebida', descripcion: 'Suave y espumoso', precio: 3000, stock: 50, promocion: false, imagen_url: '/img/cafe_leche.jpg' },
  { nombre: 'Chocolate', categoria: 'bebida', descripcion: 'Espeso y caliente', precio: 3000, stock: 40, promocion: false, imagen_url: '/img/chocolate.jpg' }
];

// ⚠️ SECURITY WARNING: Default passwords for initial setup ONLY
// These credentials are intentionally simple for first-time setup and MUST be changed
// immediately after deployment. For production, use the API to update passwords with
// strong, unique values. Consider implementing forced password change on first login.
const seedUsers = [
  { nombre: 'Administrador', email: 'admin@elsaborcolombiano.com', contrasena: 'admin123', rol: 'admin' },
  { nombre: 'Mesero Principal', email: 'mesero@elsaborcolombiano.com', contrasena: 'mesero123', rol: 'mesero' }
];

async function initializeDatabase() {
  const client = await pool.connect();

  try {
    console.log('🚀 Iniciando configuración de base de datos para Railway...');
    console.log(`📊 Conectando a: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}`);

    // Create schema
    console.log('📋 Creando esquema de base de datos...');
    await client.query(schema);
    console.log('✅ Esquema creado exitosamente');

    // Check if data already exists
    const productsResult = await client.query('SELECT COUNT(*) FROM productos');
    const productCount = parseInt(productsResult.rows[0].count);
    
    const usersResult = await client.query('SELECT COUNT(*) FROM usuarios');
    const userCount = parseInt(usersResult.rows[0].count);

    console.log(`📦 Productos existentes: ${productCount}`);
    console.log(`👥 Usuarios existentes: ${userCount}`);

    // Seed products if empty
    if (productCount === 0) {
      console.log('🌱 Insertando productos iniciales...');
      for (const product of seedProducts) {
        await client.query(
          `INSERT INTO productos (nombre, categoria, descripcion, precio, stock, promocion, imagen_url) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [product.nombre, product.categoria, product.descripcion, product.precio, product.stock, product.promocion, product.imagen_url]
        );
      }
      console.log(`✅ ${seedProducts.length} productos insertados`);
    } else {
      console.log('ℹ️  Los productos ya existen, omitiendo seed');
    }

    // Seed users if empty
    if (userCount === 0) {
      console.log('🌱 Insertando usuarios iniciales...');
      for (const user of seedUsers) {
        const contrasena_hash = await bcrypt.hash(user.contrasena, SALT_ROUNDS);
        await client.query(
          `INSERT INTO usuarios (nombre, email, contrasena_hash, rol) 
           VALUES ($1, $2, $3, $4)`,
          [user.nombre, user.email, contrasena_hash, user.rol]
        );
      }
      console.log(`✅ ${seedUsers.length} usuarios insertados`);
      console.log('');
      console.log('⚠️  ============================================');
      console.log('⚠️  CREDENCIALES INICIALES (CAMBIAR INMEDIATAMENTE):');
      console.log('   👤 Admin: admin@elsaborcolombiano.com / admin123');
      console.log('   👤 Mesero: mesero@elsaborcolombiano.com / mesero123');
      console.log('');
      console.log('🔒 ACCIÓN REQUERIDA:');
      console.log('   1. Inicia sesión con estas credenciales');
      console.log('   2. Cambia las contraseñas usando el endpoint /api/usuarios/:id');
      console.log('   3. Usa contraseñas fuertes (mínimo 12 caracteres, letras, números, símbolos)');
      console.log('⚠️  ============================================');
      console.log('');
    } else {
      console.log('ℹ️  Los usuarios ya existen, omitiendo seed');
    }

    // Display summary
    const finalProductsResult = await client.query('SELECT COUNT(*) FROM productos');
    const finalUsersResult = await client.query('SELECT COUNT(*) FROM usuarios');
    
    console.log('');
    console.log('📊 RESUMEN DE LA BASE DE DATOS:');
    console.log(`   📦 Total de productos: ${finalProductsResult.rows[0].count}`);
    console.log(`   👥 Total de usuarios: ${finalUsersResult.rows[0].count}`);
    console.log('');
    console.log('✅ Base de datos inicializada correctamente para Railway!');
    console.log('🚀 La aplicación está lista para recibir peticiones.');

  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    console.error('   Stack:', error.stack);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run initialization
initializeDatabase()
  .then(() => {
    console.log('🎉 Inicialización completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Inicialización fallida:', error.message);
    process.exit(1);
  });
