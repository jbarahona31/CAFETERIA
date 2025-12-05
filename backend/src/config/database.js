const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
  user: process.env.DB_USER || process.env.PGUSER || 'postgres',
  password: process.env.DB_PASSWORD || process.env.PGPASSWORD || '',
  database: process.env.DB_NAME || process.env.PGDATABASE || 'el_sabor_colombiano',
  port: parseInt(process.env.DB_PORT || process.env.PGPORT || '5432', 10),
  max: 10,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
