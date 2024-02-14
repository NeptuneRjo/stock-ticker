import { scrapeStocks } from './scraper/scraper'
import { Stock } from './types'
import { parseStockHtmlElements } from './scraper/htmlParsing'
import { fillDatabaseWithStocks } from './data/addStocks'
import cron from 'node-cron'
import axios from 'axios'

// 1-minute intervals
const scrapeTask = cron.schedule('* */1 * * *', async () => {
    const stockHtmlElements: string[] = await scrapeStocks()
    const stocks: Stock[] = await parseStockHtmlElements(stockHtmlElements)

    await fillDatabaseWithStocks(stocks)

    axios.get('http://websocket_container:8000/emitt-event')
        .then(() => console.log("notified socket service"))
        .catch((err) => console.log(err))
})

scrapeTask.start()