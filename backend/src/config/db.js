const mysql = require('mysql2/promise');
const { URL } = require('url');

let connection;

async function initDB() {
  if (!connection) {
    // Pega a URL do Railway
    const dbUrl = new URL(process.env.MYSQL_URL);
    //console.log('Conectando ao MySQL em:', dbUrl);

    connection = await mysql.createConnection({
      host: dbUrl.hostname,
      user: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.replace(/^\//, ''), // remove a barra inicial
      port: dbUrl.port
    });

    console.log('✅ Conectado ao MySQL!');
  }
  return connection;
}

module.exports = initDB;
