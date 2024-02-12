import cheerio from 'cheerio'
import { Stock } from '../types'

const createStockFromElement = (element: string): Stock => {
    const $ = cheerio.load(element)

    const symbol = $(element).find('a').text()
    const name = $(element).find('td').eq(1).text()
    const last_price = $(element).find('td').eq(2).find('fin-streamer').text()
    const change = $(element).find('td').eq(3).find('fin-streamer').text()
    const change_percent = $(element).find('td').eq(4).find('fin-streamer').text()
    const volume = $(element).find('td').eq(5).find('fin-streamer').text()
    const market_cap = $(element).find('td').eq(7).find('fin-streamer').text()

    return {
        symbol,
        name,
        last_price: Number(last_price),
        change,
        change_percent,
        volume,
        market_cap
    }
}

export async function parseStockHtmlElements(htmlElements: string[]): Promise<Stock[]> {
    const parsedElements: Stock[] = []
    const startTime = performance.now()
    
    htmlElements.forEach((element) => parsedElements.push(createStockFromElement(element)))

    const endTime = performance.now()

    console.log(`Parse time in seconds: ${Math.round((endTime - startTime) / 1000)}`)

    return parsedElements
}