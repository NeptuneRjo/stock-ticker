import cron from 'node-cron'
import puppeteer from 'puppeteer'
import cheerio from 'cheerio'
import './data/initializePostgres'

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
}
app()


async function scrapeStocks (): Promise<string[]> {
    try {
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
        return tableRows
    } catch (error) {
        console.error(error)
        throw new Error()
    }
}

async function parseStockHtmlElements(htmlElements: string[]): Promise<Stock[]> {
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

    return parsedElements
}