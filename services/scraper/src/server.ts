import { scrapeStocks } from './scraper/scraper'
import { Stock } from './types'
import { parseStockHtmlElements } from './scraper/htmlParsing'
import { fillDatabaseWithStocks } from './data/addStocks'
import client from './data/initializePostgres'
import express, { Request, Response } from 'express'

const app = express()

const scrapeAndPopulateDb = async () => {
    const stockHtmlElements: string[] = await scrapeStocks()
    const stocks: Stock[] = await parseStockHtmlElements(stockHtmlElements)

    await fillDatabaseWithStocks(stocks)
}

app.get("/", async (req: Request, res: Response) => {
    await scrapeAndPopulateDb()

    res.send(200)
})

const port = process.env.PORT || 4000

app.listen(port, () => {
	console.log(`Server sucessfully started and listening on port ${port}`)
})