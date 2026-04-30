const mysql = require('mysql2/promise');
require('dotenv').config();

const sslOptions = process.env.DB_SSL === 'true'
  ? { rejectUnauthorized: true, minVersion: 'TLSv1.2' }
  : false;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 4000,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  ssl: sslOptions
});

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connexion TiDB réussie');
    connection.release();
  } catch (error) {
    console.error('❌ Erreur connexion TiDB :', error.message);
    process.exit(1);
  }
};

module.exports = { pool, testConnection };