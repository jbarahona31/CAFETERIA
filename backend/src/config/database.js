const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '',
  database: process.env.PGDATABASE || 'el_sabor_colombiano',
  port: parseInt(process.env.PGPORT || '5432', 10),
  max: 10
});

module.exports = pool;
