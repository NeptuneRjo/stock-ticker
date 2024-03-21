import { Stock } from '../types'
import * as db from './db'

export const updateStocksInDatabase = async (stocks: Stock[]) => {
    const startTime = performance.now()
    
    try {
        // Clear stock table
        await db.query('TRUNCATE TABLE stocks RESTART IDENTITY CASCADE')
        
        stocks.forEach(async (stock) => {
            // Add updated stocks
            await addStock(stock)
                            
            // Delete any stock_history rows that dont have a counter part
            // Or if they're over 24 hours old
            const cleanStockHistory = `
                DELETE FROM stock_history
                WHERE symbol NOT IN (SELECT symbol FROM stocks)
                OR price_timestamp < 
                CURRENT_TIMESTAMP - INTERVAL '24 hours'
            `
            await db.query(cleanStockHistory)
            
            // Add new rows to stock_history
            await addStockHistory(stock.last_price, stock.symbol)
        })
        
        const endTime = performance.now()
        
        console.log(`Update database time in seconds: ${Math.round((endTime - startTime) / 1000)}`)
    } catch (error) {
        console.log(error)   
    }
}

export const addStocksToDatabase = async (stocks: Stock[]) => {
    const startTime = performance.now()
    
    try {
        await db.query('TRUNCATE TABLE stocks RESTART IDENTITY CASCADE')
        await db.query('TRUNCATE TABLE stock_history RESTART IDENTITY CASCADE')
        
        stocks.forEach(async (stock) => {
            await addStock(stock)
            await addStockHistory(stock.last_price, stock.symbol)
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
            price_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            symbol VARCHAR(32) NOT NULL
        )
    `
        
    await db.query(text)
}
        
export const getStocksFromDatabase = async (): Promise<any[]> => {
    // Returns the stocks with an array of objects containing the price and its timestamp
    const text = `
        SELECT 
            s.symbol, 
            s.name, 
            s.last_price, 
            s.change, 
            s.change_percent, 
            s.volume, 
            s.market_cap, 
            json_agg(json_build_object('price', sh.price, 'timestamp', sh.price_timestamp)) AS history
        FROM stocks s
        LEFT JOIN stock_history sh ON s.symbol = sh.symbol
        GROUP BY s.stock_id
    `
    const results = await db.query(text)
    
    return results.rows
}

async function addStockHistory (last_price: number, symbol: string) {
    const query = `
        INSERT INTO stock_history (price, symbol)
        VALUES ($1, $2)
    `
    const values = [
        last_price,
        symbol
    ]
    await db.query(query, values)
}

async function addStock (stock: Stock) {
    const query = `
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
        ON CONFLICT (symbol) DO NOTHING
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
    await db.query(query, values)
}