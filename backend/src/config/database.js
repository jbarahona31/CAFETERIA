const { Pool } = require('pg');
require('dotenv').config();

let pool;

if (process.env.DATABASE_URL) {
  // 🚀 Simplificado para Railway (usa DATABASE_URL)
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Railway requiere SSL
    },
  });
} else {
  // 🖥️ Configuración detallada para desarrollo local
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'MmosgDOxUMLhdpAMauLdHiNbWxsljAPn',
    database: process.env.DB_NAME || 'el_sabor_colombiano',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    max: 10,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
}

// 🔎 Verificación de conexión
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error de conexión con PostgreSQL:', err.message);
  } else {
    console.log('✅ Conexión exitosa con PostgreSQL. Hora actual:', res.rows[0].now);
  }
});

module.exports = pool;
