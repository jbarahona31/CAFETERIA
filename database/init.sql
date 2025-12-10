-- El Sabor Colombiano - PostgreSQL Database Initialization
-- This script creates the database schema and inserts seed data
-- Run this script to initialize a fresh database

-- ============================================
-- SCHEMA CREATION
-- ============================================

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
  correo VARCHAR(120) UNIQUE NOT NULL,
  contraseña VARCHAR(255) NOT NULL,
  rol VARCHAR(20) DEFAULT 'mesero',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_promocion ON productos(promocion);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_detalle_pedido_pedido ON detalle_pedido(pedido_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON usuarios(correo);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);

-- ============================================
-- SEED DATA
-- ============================================

-- Seed products
INSERT INTO productos (nombre, categoria, descripcion, precio, stock, promocion, imagen_url) VALUES
('Papas rellenas', 'comida', 'Crujientes y doradas, con relleno casero', 4500, 20, FALSE, '/img/papas.jpg'),
('Empanada de pollo', 'comida', 'Pollo desmechado con especias', 2000, 50, TRUE, '/img/emp_pollo.jpg'),
('Empanada de carne', 'comida', 'Carne sazonada, masa crocante', 2000, 50, FALSE, '/img/emp_carne.jpg'),
('Empanada ranchera', 'comida', 'Sabor picantico, estilo ranchero', 2200, 40, FALSE, '/img/emp_ranchera.jpg'),
('Arepa de carne', 'comida', 'Arepa rellena con carne', 5000, 25, FALSE, '/img/arepa_carne.jpg'),
('Arepa de queso', 'comida', 'Queso derretido, masa suave', 4500, 30, TRUE, '/img/arepa_queso.jpg'),
('Avena', 'bebida', 'Refrescante y cremosa', 3000, 40, FALSE, '/img/avena.jpg'),
('Jugo de mora', 'bebida', 'Natural y fresco', 3500, 30, FALSE, '/img/jugo_mora.jpg'),
('Jugo de guanábana', 'bebida', 'Dulce y cremoso', 4000, 25, FALSE, '/img/jugo_guanabana.jpg'),
('Jugo de tomate de árbol', 'bebida', 'Ácido y energético', 3500, 25, FALSE, '/img/jugo_tomate.jpg'),
('Jugo de guayaba', 'bebida', 'Aromático y suave', 3500, 25, TRUE, '/img/jugo_guayaba.jpg'),
('Café', 'bebida', 'Tostión media, sabor tradicional', 2500, 60, FALSE, '/img/cafe.jpg'),
('Café con leche', 'bebida', 'Suave y espumoso', 3000, 50, FALSE, '/img/cafe_leche.jpg'),
('Chocolate', 'bebida', 'Espeso y caliente', 3000, 40, FALSE, '/img/chocolate.jpg');
