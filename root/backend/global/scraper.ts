import puppeteer from 'puppeteer'
import { io } from '../server'
import { getEstDate, readJsonFile, writeJsonFile } from './util'

export const scrape = async () => {
	try {
		const browser = await puppeteer.launch()
		const page = await browser.newPage()

		await page.goto('https://finance.yahoo.com/most-active/?offset=0&count=50')

		// Set screen size
		await page.setViewport({ width: 1920, height: 1080 })

		// Gets the 50 symbols and stores them as an array
		const symbolsArray = await page.evaluate(() =>
			Array.from(
				document.querySelectorAll('div#scr-res-table div table tbody tr td a'),
				(element) => element.textContent
			)
		)

		if (symbolsArray.length < 5) {
			throw Error(
				'The returned length of the symbols is less than 5, skipping JSON overwrite'
			)
		}

		return symbolsArray.slice(0, 5)
	} catch (error) {
		console.log('Scrape Error: ', error)
		return undefined
	}
}

export const scrapeAndUpdate = async () => {
	try {
		const filePath = './data/symbols.json'
		const estDate = await getEstDate()
		const symbolsArray = await scrape()
		const jsonData = await readJsonFile(filePath)

		jsonData.date = estDate
		// Keep the symbols the same if none are returned from the scrape
		jsonData.symbols =
			symbolsArray === undefined ? jsonData.symbols : symbolsArray

		await writeJsonFile(filePath, jsonData)

		const updatedJson = await readJsonFile(filePath)

		io.emit('update-symbols', updatedJson)
	} catch (error) {
		console.log(error)
	}
}
