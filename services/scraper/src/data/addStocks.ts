import { Stock } from "../types"
import client from "./initializePostgres"

const addStockToDatabase = async (stock: Stock) => {
    const query = {
        text: 'INSERT INTO stocks (symbol, name, last_price, change, change_percent, volume, market_cap) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        values: [stock.symbol, stock.name, stock.last_price, stock.change, stock.change_percent, stock.volume, stock.market_cap]
    }

    await client.query(query)
}

export async function fillDatabaseWithStocks(stocks: Stock[]) {
    const startTime = performance.now()

    // Clears the stocks table
    await client.query('TRUNCATE TABLE stocks CASCADE')

    try {
        stocks.forEach(async (stock, index) => {
            await addStockToDatabase(stock)
        })

        const endTime = performance.now()

        console.log(`Fill database time in seconds: ${Math.round((endTime - startTime) / 1000)}`)
    } catch (error) {
        console.error(error)
        throw new Error()
    }
}