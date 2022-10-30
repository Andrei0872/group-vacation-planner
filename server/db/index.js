import * as dotnev from 'dotenv'
import pg from 'pg'

dotnev.config({
  path: '../.env'
});

const { Pool } = pg;

const dbConfig = {
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
}

export const pool = new Pool(dbConfig);

try {
  await new Promise((resolve, reject) => {
    pool.query('SELECT NOW()', (err, res) => {
      if (err) {
        return reject(err);
      }

      resolve(res);
    });
  })

  console.log('Successfully connected to the database.');
} catch (err) {
  console.error('An error occurred while connecting to the database');
  pool.end();
  process.exit(1);
}