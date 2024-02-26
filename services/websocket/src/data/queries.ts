import { Stock } from '../types'
import * as db from './db'

export const addStocksToDatabase = async (stocks: Stock[]) => {
    const startTime = performance.now()

    try {
        await db.query('TRUNCATE TABLE stocks  RESTART IDENTITY CASCADE')

        stocks.forEach(async (stock) => {
            const text = `
                INSERT INTO stocks (
                    symbol, 
                    name, 
                    last_price, 
                    change, 
                    change_percent, 
                    volume, 
                    market_cap
                ) 
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `
            
            const values = [
                stock.symbol, 
                stock.name, 
                stock.last_price, 
                stock.change, 
                stock.change_percent, 
                stock.volume, 
                stock.market_cap
            ]

            await db.query(text, values)
        })

        const endTime = performance.now()

        console.log(`Fill database time in seconds: ${Math.round((endTime - startTime) / 1000)}`)
    } catch (error) {
        console.error(error)
        throw new Error()
    }
}

export const setupStockTable = async () => {
    const text = `
        CREATE TABLE IF NOT EXISTS stocks (
            stock_id SERIAL PRIMARY KEY, 
            symbol VARCHAR(32) NOT NULL UNIQUE, 
            name VARCHAR(64) NOT NULL, 
            last_price NUMERIC NOT NULL, 
            change VARCHAR(24) NOT NULL, 
            change_percent VARCHAR(24) NOT NULL, 
            volume VARCHAR(24) NOT NULL, 
            market_cap VARCHAR(24) NOT NULL
        )
    `
    await db.query(text)
}

export const setupStockHistoryTable = async () => {
    const text = `
        CREATE TABLE IF NOT EXISTS stock_history (
            stock_history_id SERIAL PRIMARY KEY,
            price NUMERIC NOT NULL,
            price_timestamp TIMESTAMP NOT NULL,
            stock_id INTEGER REFERENCES stocks (stock_id)
        )
    `

    await db.query(text)
}

export const getStocksFromDatabase = async (): Promise<any[]> => {
    const text = `SELECT * FROM stocks`
    const results = await db.query(text)

    return results.rows
}