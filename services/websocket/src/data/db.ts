import { Pool } from 'pg'

const pool = new Pool()

/**
 * Query the database and return a node-pg res object.
 * 
 * Use params to pass values without concatenating query text. 
 * Null by default.
 * 
 * @example
 *  const text = `INSERT INTO table(title, content) VALUES($1, $2)` 
 *  const params = ['New Title', 'Hello World!']

 */
export const query = async (text: string, params: any[] | null = null) => {
    // Logs queries from everywhere in the application
    // https://node-postgres.com/guides/project-structure
    const startTime = performance.now()
    const res = await pool.query(text, params)
    const duration = Math.round((performance.now() - startTime) / 1000)

    console.log('executed query', { text, duration, rows: res.rowCount })    

    return res
}