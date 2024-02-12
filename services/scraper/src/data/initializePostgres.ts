import { Client } from 'pg'

const client = new Client()

client.connect().then(async () => {
    await setupStockTable()
})

async function setupStockTable () {
    const text = `
        CREATE TABLE IF NOT EXISTS stocks (
            stock_id SERIAL PRIMARY KEY, 
            symbol VARCHAR(32) NOT NULL, 
            name VARCHAR(64) NOT NULL, 
            last_price NUMERIC NOT NULL, 
            change VARCHAR(24) NOT NULL, 
            change_percent VARCHAR(24) NOT NULL, 
            volume VARCHAR(24) NOT NULL, 
            market_cap VARCHAR(24) NOT NULL
        )
    `
    await client.query(text)
}

export default client