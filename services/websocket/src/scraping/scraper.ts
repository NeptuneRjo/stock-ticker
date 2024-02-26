import puppeteer from 'puppeteer'
import { Stock } from '../types'
import * as htmlParser from './htmlParsing'

async function scrapeStockTable (): Promise<string> {
    try {
        const startTime = performance.now()
        const browser = await puppeteer.launch()
        const page = await browser.newPage()

        await page.goto('https://finance.yahoo.com/most-active/?offset=0&count=250')

        await page.waitForSelector('table')

        // Pull the entire table
        const stockTable = await page.evaluate(() => {
            const table = document.querySelector('table')
            const tableHTML = table?.outerHTML

            return tableHTML
        })

        if (stockTable === null || stockTable === undefined) {
            throw new Error("Error retrieving stock table")
        }

        await browser.close()
        
        const endTime = performance.now()

        console.log(`Scraping time in seconds: ${Math.round((endTime - startTime) / 1000)}` )

        return stockTable
    } catch (error) {
        console.error(error)
        throw new Error()
    }
}

export const scrapeAndProcessData = async (): Promise<Stock[]> => {
    // Full table
    const stockTableHTML: string = await scrapeStockTable()

    // Pull the row (<tr>) elements from the table
    const tableRowsHTML: string[] = htmlParser.pullRowsFromStockTable(stockTableHTML)

    // Parse the rows into stocks
    const stocks: Stock[] = await htmlParser.parseStockRowElements(tableRowsHTML)

    return stocks
}