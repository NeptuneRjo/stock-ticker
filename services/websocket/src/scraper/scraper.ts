import puppeteer from 'puppeteer'

export async function scrapeStocks (): Promise<string[]> {
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