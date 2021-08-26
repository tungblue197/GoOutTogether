import pg from 'pg';
import database from 'configs/database';
const { Pool, Client } = pg;

export const pool = new Pool(database);

export const client = new Client(database);


export default pool;