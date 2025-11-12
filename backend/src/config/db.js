const mysql = require('mysql2/promise');

let connection;

async function initDB() {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Conectado ao MySQL!');
  }

  return connection;
}

module.exports = initDB;
