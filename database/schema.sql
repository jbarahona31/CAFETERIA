-- El Sabor Colombiano - Database Schema
-- Create database (run as admin/root)
CREATE DATABASE IF NOT EXISTS el_sabor_colombiano CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE el_sabor_colombiano;

-- Tabla productos
CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  categoria ENUM('comida','bebida') NOT NULL,
  descripcion VARCHAR(255),
  precio DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  promocion BOOLEAN DEFAULT FALSE,
  imagen_url VARCHAR(255)
);

-- Tabla pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente VARCHAR(120),
  estado ENUM('pendiente','preparacion','listo','entregado','cancelado') DEFAULT 'pendiente',
  total DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla detalle_pedido
CREATE TABLE IF NOT EXISTS detalle_pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Indexes for better performance
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_promocion ON productos(promocion);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_detalle_pedido_pedido ON detalle_pedido(pedido_id);
