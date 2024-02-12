import cron from 'node-cron'
import puppeteer from 'puppeteer'
import cheerio from 'cheerio'
import client from './data/initializePostgres'

type Stock = {
    symbol: string,
    name: string,
    last_price: number,
    change: string,
    change_percent: string,
    volume: string,
    market_cap: string
}

const app = async () => {
    const stockHtmlElements: string[] = await scrapeStocks()
    const stocks: Stock[] = await parseStockHtmlElements(stockHtmlElements)

    await fillDatabaseWithStocks(stocks)
}
app()

async function scrapeStocks (): Promise<string[]> {
    try {
        const startTime = performance.now()
        const browser = await puppeteer.launch()
        const page = await browser.newPage()

        await page.goto('https://finance.yahoo.com/most-active/?offset=0&count=100')
        await page.setViewport({ width: 1920, height: 1080 })

        await page.waitForSelector('tr.simpTblRow')

        const tableRows: string[] = await page.evaluate(() => {
            const elements = document.querySelectorAll('tr.simpTblRow')
            const elementsArray = Array.from(elements)

            const elementsHtmlArray = elementsArray.map(element => element.outerHTML)

            return elementsHtmlArray
        })

        await browser.close()
        
        const endTime = performance.now()

        console.log(`Scraping time in seconds: ${Math.round((endTime - startTime) / 1000)}` )

        return tableRows
    } catch (error) {
        console.error(error)
        throw new Error()
    }
}

async function parseStockHtmlElements(htmlElements: string[]): Promise<Stock[]> {
    const startTime = performance.now()
    const parsedElements: Stock[] = []
    
    htmlElements.forEach((element, index) => {
        const $ = cheerio.load(element)

        const symbol = $(element).find('a').text()
        const name = $(element).find('td').eq(1).text()
        const last_price = $(element).find('td').eq(2).find('fin-streamer').text()
        const change = $(element).find('td').eq(3).find('fin-streamer').text()
        const change_percent = $(element).find('td').eq(4).find('fin-streamer').text()
        const volume = $(element).find('td').eq(5).find('fin-streamer').text()
        const market_cap = $(element).find('td').eq(7).find('fin-streamer').text()

        const stock: Stock = {
            symbol,
            name,
            last_price: Number(last_price),
            change,
            change_percent,
            volume,
            market_cap
        }

        parsedElements.push(stock)
    })

    const endTime = performance.now()

    console.log(`Parse time in seconds: ${Math.round((endTime - startTime) / 1000)}`)

    return parsedElements
}

async function fillDatabaseWithStocks(stocks: Stock[]) {
    const startTime = performance.now()

    // Clears the stocks table
    await client.query('TRUNCATE TABLE stocks')

    try {
        stocks.forEach(async (stock, index) => {
            const query = {
                text: 'INSERT INTO stocks (symbol, name, last_price, change, change_percent, volume, market_cap) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                values: [stock.symbol, stock.name, stock.last_price, stock.change, stock.change_percent, stock.volume, stock.market_cap]
            }

            await client.query(query)
        })

        const endTime = performance.now()

        console.log(`Fill database time in seconds: ${Math.round((endTime - startTime) / 1000)}`)
    } catch (error) {
        console.error(error)
        throw new Error()
    }
}
