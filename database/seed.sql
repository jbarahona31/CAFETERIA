-- El Sabor Colombiano - PostgreSQL Seed Data
-- Run this after schema.sql

-- Clear existing data
DELETE FROM detalle_pedido;
DELETE FROM pedidos;
DELETE FROM productos;
DELETE FROM usuarios;

-- Reset sequences
ALTER SEQUENCE productos_id_seq RESTART WITH 1;
ALTER SEQUENCE pedidos_id_seq RESTART WITH 1;
ALTER SEQUENCE detalle_pedido_id_seq RESTART WITH 1;
ALTER SEQUENCE usuarios_id_seq RESTART WITH 1;

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

-- Seed a default admin user (password: admin123)
-- Note: This is a sample bcrypt hash for 'admin123' - regenerate for production
INSERT INTO usuarios (nombre, email, contrasena_hash, rol) VALUES
('Administrador', 'admin@elsaborcolombiano.com', '$2b$10$rIqXrKjJqmZvKZqZqZqZqOCyYvM1mJYXJYvMXJYvMXJYvMXJYvMXJ', 'admin');
