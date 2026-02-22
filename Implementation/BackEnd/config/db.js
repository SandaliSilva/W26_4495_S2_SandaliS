const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '@Umnotinto23', 
  database: 'safesight_db',
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool.promise();