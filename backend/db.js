import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false 
    }
});


pool.query('SELECT NOW()')
    .then(() => console.log("Connection success"))
    .catch((err) => console.error("Error Connecting Database", err));

export default pool;