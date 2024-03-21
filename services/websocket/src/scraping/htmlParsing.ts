import cheerio from 'cheerio'
import { Stock } from '../types'

export const createStockFromElement = (element: string): Stock => {
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
        last_price: Number(last_price.replace(/,/g, '')),
        change,
        change_percent,
        volume,
        market_cap
    }
}

export function pullRowsFromStockTable(stockTable: string): string[] {
    const rows: string[] = []
    const $ = cheerio.load(stockTable)
    
    $(stockTable).find('tr.simpTblRow').each((index: number, element: any) => {
        rows.push($.html(element))
    })

    return rows
}

export async function parseStockRowElements(rowElements: string[]): Promise<Stock[]> {
    const parsedElements: Stock[] = []
    
    rowElements.forEach((element) => {
        const stock = createStockFromElement(element)
        parsedElements.push(stock)
    })

    return parsedElements
}
