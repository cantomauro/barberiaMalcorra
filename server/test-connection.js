// server/test-connection.js
require('dotenv').config();
const db = require('./db');

async function test() {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    console.log('¡Conexión OK! 1+1 =', rows[0].result);
  } catch (err) {
    console.error('Error de conexión:', err);
  } finally {
    db.end();
  }
}

test();
