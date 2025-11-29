require('dotenv').config();
const mysql = require('mysql2/promise');

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

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'el_sabor_colombiano'
  });

  try {
    console.log('🌱 Iniciando seed de datos...');

    // Clear existing data
    await connection.query('DELETE FROM detalle_pedido');
    await connection.query('DELETE FROM pedidos');
    await connection.query('DELETE FROM productos');
    
    console.log('✓ Datos anteriores eliminados');

    // Insert products
    for (const product of seedProducts) {
      await connection.query(
        `INSERT INTO productos (nombre, categoria, descripcion, precio, stock, promocion, imagen_url) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [product.nombre, product.categoria, product.descripcion, product.precio, product.stock, product.promocion, product.imagen_url]
      );
    }

    console.log(`✓ ${seedProducts.length} productos insertados`);
    console.log('✅ Seed completado exitosamente!');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seed();
