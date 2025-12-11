const { Pool } = require("pg");

// Validar variables requeridas
if (
  !process.env.DB_HOST ||
  !process.env.DB_PORT ||
  !process.env.DB_USER ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_NAME
) {
  throw new Error(
    "Faltan variables de entorno requeridas (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME)"
  );
}

// Crear pool de conexión
const pool = new Pool({
  host: process.env.DB_HOST,               // postgres.railway.internal
  port: parseInt(process.env.DB_PORT, 10), // 5432
  user: process.env.DB_USER,               // postgres
  password: process.env.DB_PASSWORD,       // contraseña correcta de Railway
  database: process.env.DB_NAME,           // railway
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }        // necesario en Railway
    : false
});

// Log de conexión para depuración
console.log(`[DB] Conectando a ${process.env.DB_HOST}:${process.env.DB_PORT} como ${process.env.DB_USER}`);

module.exports = pool;
