export const initializeStockTable = async (client: any) => {
    const text = `
        CREATE TABLE IF NOT EXISTS stocks (
            stock_id SERIAL PRIMARY KEY, 
            symbol VARCHAR(32) NOT NULL, 
            name VARCHAR(64) NOT NULL, 
            last_price NUMERIC NOT NULL, 
            market_time VARCHAR(24), 
            change NUMERIC NOT NULL, 
            change_positive BOOLEAN NOT NULL, 
            change_percent NUMERIC NOT NULL, 
            volume VARCHAR(24) NOT NULL, 
            market_cap VARCHAR(24) NOT NULL
        )
    `
    await client.query(text)
}