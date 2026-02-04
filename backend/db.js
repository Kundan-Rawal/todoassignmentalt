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

// Test the connection immediately
pool.query('SELECT NOW()')
    .then(() => console.log("✅ Connected to Neon PostgreSQL successfully"))
    .catch((err) => console.error("❌ Database connection error:", err));

export default pool;