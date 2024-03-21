import puppeteer from 'puppeteer'
import { Stock } from '../types'
import * as htmlParser from './htmlParsing'

const loginToPage = async (page: any) => {
    // signin button
    await page.click('div#login-container > a')

    // login
    await page.waitForSelector('#login-username')
    await page.$eval('#login-username', (el: any) => el.value = 'marketwatch426@gmail.com')
    await page.click('#login-signin')

    await page.waitForSelector('#login-passwd')
    await page.$eval('#login-passwd', (el: any) => el.value = "UMYu~hW6:9'r5N_")
    await page.click('#login-signin')

    await page.waitForSelector('#ybar-logo')
}

const scrapeStockTable = async (): Promise<string[]> => {
    try {
        const startTime = performance.now()

        const browser = await puppeteer.launch()
        const page = await browser.newPage()

        // go to homepage
        await page.goto('https://www.yahoo.com/')

        await loginToPage(page)

        // go to stock page
        await page.goto('https://finance.yahoo.com/screener/d0bc88d2-31fc-4a9c-8735-ac045bccfc5a?count=100')
        await page.waitForSelector('table')

        const tables: string[] = []
        
        // scrape table        
        // move to next table
        let nextIsEnabled = true
        while (nextIsEnabled) {
            const nextButton = await page.$('#scr-res-table > div:nth-child(2) > button:nth-child(4)[aria-disabled="false"]')

            if (!nextButton) {
                nextIsEnabled = false
            } else {
                const stockTable: string = await page.$eval('table', (el: any) => el.outerHTML)
                tables.push(stockTable)
                
                await nextButton.click()
                await page.waitForSelector('div[data-test="table-overlay"]', { hidden: true })
    
                const url = page.url()
                // cut-off at 2500 to prevent crashing
                if (url.includes('&offset=2500')) {
                    break
                }
            }
        }
        

        await page.deleteCookie()
        await page.close()
        await browser.close()
        
        const endTime = performance.now()

        console.log(`Scraping time in seconds: ${Math.round((endTime - startTime) / 1000)}` )

        return tables
    } catch (error) {
        console.error(error)
        throw new Error()
    }
}

export const scrapeAndProcessData = async (): Promise<Stock[]> => {
    // Full table
    const stockTableHTML: string[] = await scrapeStockTable()

    // Pull the row (<tr>) elements from the table
    const tableRowsHTML: string[][] = []

    stockTableHTML.forEach(table => {
        const rows = htmlParser.pullRowsFromStockTable(table)

        tableRowsHTML.push(rows)
    });

    // Parse the rows into stocks
    const stocks: Stock[] = []

    tableRowsHTML.forEach(async (row) => {
        const parsedStocks = await htmlParser.parseStockRowElements(row)

        parsedStocks.forEach((stock) => {
            stocks.push(stock)
        })
    })

    return stocks
}