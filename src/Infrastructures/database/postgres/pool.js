/* eslint-disable no-shadow */
/* istanbul ignore file */
const { Pool } = require('pg');

const testConfig = {
  host: process.env.PGHOST_TEST,
  port: process.env.PGPORT_TEST,
  user: process.env.PGUSER_TEST,
  password: process.env.PGPASSWORD_TEST,
  database: process.env.PGDATABASE_TEST,
};

const pool = process.env.NODE_ENV === 'test' ? new Pool(testConfig) : new Pool();

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack); // Jika ada error saat memperoleh client, tampilkan error
  } else {
    // Mengatur timezone ke UTC setelah terhubung
    client.query('SET timezone = \'UTC\'', (err, res) => {
      if (err) {
        console.error('Error setting timezone to UTC', err.stack); // Jika ada error saat mengatur timezone
      }
      release(); // melepaskan koneksi setelah selesai
    });
  }
});
module.exports = pool;
