import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DB_URL || '';


const sql = postgres(connectionString, {
  ssl: 'require',
  max: 20,
  idle_timeout: 30,
  connect_timeout: 30,
});

export default sql;