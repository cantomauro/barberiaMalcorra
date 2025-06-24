// db.js
const sql = require('mssql');

const dbConfig = {
  user: 'root@localhost',
  password: 'Marianella1975',
  server: 'localhost',
  database: 'barberia',
  options: {
    trustServerCertificate: true,
  }
};

module.exports = { sql, dbConfig };

