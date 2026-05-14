import pg from 'pg'
const { Pool } = pg
import dotenv from 'dotenv'
dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes("render.com") 
   ? { rejectUnauthorized: false } 
    : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
})

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})

export const db = {
  async query(text, params) {
    if (process.env.ENABLE_SQL_LOGGING === 'true') {
      const start = Date.now()
      const res = await pool.query(text, params)
      const duration = Date.now() - start
      console.log('Executed query:', { text: text.replace(/\s+/g, ' ').trim(), duration: `${duration}ms`, rows: res.rowCount })
      return res
    } else {
      return pool.query(text, params)
    }
  }
}

export const testConnection = async () => {
  try {
    const result = await db.query('SELECT NOW() as current_time')
    console.log('Database connection successful:', result.rows[0].current_time)
    return true
  } catch (error) {
    console.error('Database connection failed:', error.message)
    throw error
  }
}
