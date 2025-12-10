/**
 * Script de verificación de configuración de base de datos
 * Verifica que la conexión a PostgreSQL funcione correctamente
 */

const pool = require('../config/database');

async function verifyDatabaseConfig() {
  console.log('🔍 Verificando configuración de base de datos...\n');

  // Check environment variables
  console.log('📋 Variables de entorno:');
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? '✓ Configurada' : '✗ No configurada'}`);
  console.log(`   DB_HOST: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`   DB_PORT: ${process.env.DB_PORT || '5432'}`);
  console.log(`   DB_USER: ${process.env.DB_USER || 'postgres'}`);
  console.log(`   DB_NAME: ${process.env.DB_NAME || 'el_sabor_colombiano'}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log('');

  const client = await pool.connect();

  try {
    // Test connection
    console.log('🔌 Probando conexión...');
    const timeResult = await client.query('SELECT NOW() as current_time');
    console.log(`   ✅ Conectado exitosamente`);
    console.log(`   📅 Hora del servidor: ${timeResult.rows[0].current_time}`);
    console.log('');

    // Check database version
    const versionResult = await client.query('SELECT version()');
    const version = versionResult.rows[0].version;
    console.log('🐘 Versión de PostgreSQL:');
    console.log(`   ${version.split(',')[0]}`);
    console.log('');

    // Check if tables exist
    console.log('📊 Verificando tablas...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    if (tablesResult.rows.length === 0) {
      console.log('   ⚠️  No se encontraron tablas');
      console.log('   💡 Ejecuta: npm run init-db');
    } else {
      console.log(`   ✅ Se encontraron ${tablesResult.rows.length} tablas:`);
      tablesResult.rows.forEach(row => {
        console.log(`      - ${row.table_name}`);
      });
    }
    console.log('');

    // Check data counts
    if (tablesResult.rows.some(row => row.table_name === 'productos')) {
      const productCount = await client.query('SELECT COUNT(*) FROM productos');
      console.log('📦 Datos:');
      console.log(`   Productos: ${productCount.rows[0].count}`);

      if (tablesResult.rows.some(row => row.table_name === 'usuarios')) {
        const userCount = await client.query('SELECT COUNT(*) FROM usuarios');
        console.log(`   Usuarios: ${userCount.rows[0].count}`);
      }

      if (tablesResult.rows.some(row => row.table_name === 'pedidos')) {
        const orderCount = await client.query('SELECT COUNT(*) FROM pedidos');
        console.log(`   Pedidos: ${orderCount.rows[0].count}`);
      }
      console.log('');
    }

    console.log('✅ Verificación completada exitosamente!');
    return true;

  } catch (error) {
    console.error('❌ Error durante la verificación:');
    console.error(`   ${error.message}`);
    console.error('');
    console.error('💡 Posibles soluciones:');
    console.error('   1. Verifica que PostgreSQL esté corriendo');
    console.error('   2. Verifica las credenciales en el archivo .env');
    console.error('   3. Verifica que la base de datos exista');
    console.error('   4. Si es Railway, verifica que DATABASE_URL esté configurada');
    return false;
  } finally {
    client.release();
    await pool.end();
  }
}

verifyDatabaseConfig()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error.message);
    process.exit(1);
  });
