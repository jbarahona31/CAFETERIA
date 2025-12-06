const pool = require('../config/database');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

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

// Initial users with plain text passwords - will be hashed during seed
const seedUsers = [
  { nombre: 'Administrador', email: 'admin@elsaborcolombiano.com', contrasena: 'admin123', rol: 'admin' },
  { nombre: 'Mesero Principal', email: 'mesero@elsaborcolombiano.com', contrasena: 'mesero123', rol: 'mesero' }
];

async function seed() {
  const client = await pool.connect();

  try {
    console.log('🌱 Iniciando seed de datos...');

    // Clear existing data
    await client.query('DELETE FROM detalle_pedido');
    await client.query('DELETE FROM pedidos');
    await client.query('DELETE FROM productos');
    await client.query('DELETE FROM usuarios');
    
    console.log('✓ Datos anteriores eliminados');

    // Reset sequences
    await client.query('ALTER SEQUENCE productos_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE pedidos_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE detalle_pedido_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE usuarios_id_seq RESTART WITH 1');

    // Insert products
    for (const product of seedProducts) {
      await client.query(
        `INSERT INTO productos (nombre, categoria, descripcion, precio, stock, promocion, imagen_url) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [product.nombre, product.categoria, product.descripcion, product.precio, product.stock, product.promocion, product.imagen_url]
      );
    }

    console.log(`✓ ${seedProducts.length} productos insertados`);

    // Insert users with hashed passwords
    for (const user of seedUsers) {
      const contrasena_hash = await bcrypt.hash(user.contrasena, SALT_ROUNDS);
      await client.query(
        `INSERT INTO usuarios (nombre, email, contrasena_hash, rol) 
         VALUES ($1, $2, $3, $4)`,
        [user.nombre, user.email, contrasena_hash, user.rol]
      );
    }

    console.log(`✓ ${seedUsers.length} usuarios insertados`);
    console.log('  - Admin: admin@elsaborcolombiano.com / admin123');
    console.log('  - Mesero: mesero@elsaborcolombiano.com / mesero123');
    console.log('✅ Seed completado exitosamente!');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
