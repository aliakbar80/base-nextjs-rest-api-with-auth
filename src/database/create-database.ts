import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const createDatabase = async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });

  const databaseName = process.env.DB_DATABASE;

  try {
    await client.connect();

    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = '${databaseName}';`,
    );

    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${databaseName}"`);
      console.log(`Database "${databaseName}" created successfully.`);
    } else {
      console.log(`Database "${databaseName}" is found.`);
    }
  } catch (error) {
    console.error('Error creating database:', error.message);
  } finally {
    await client.end();
  }
};

export { createDatabase };
