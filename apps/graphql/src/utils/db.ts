import camelcaseKeys from 'camelcase-keys';
import pgPromise from 'pg-promise';

import 'dotenv/config';

const pgp = pgPromise({
  receive(e) {
    // @ts-expect-error rows unexpected for some reason...
    e.result.rows = camelcaseKeys(e.data, { deep: true });
  },
});

export const dbPool = pgp({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

export let dbConnectionReady = false;

dbPool
  .connect()
  .then((obj) => {
    console.log('Database connection successful');
    dbConnectionReady = true;
    obj.done();
  })
  .catch((error) => {
    console.error('DB connection error:', error.message || error);
  });
