import puppeteer from 'puppeteer'
import { readFileSync, writeFileSync, existsSync } from 'fs'

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

		if (symbolsArray.length < 50) {
			throw Error(
				'The returned length of the symbols is less that 50, skipping JSON overwrite'
			)
		}

		return symbolsArray
	} catch (error) {
		console.log('Scrape Error: ', error)
		return undefined
	}
}

export default async function updateSymbolsJson() {
	if (existsSync('symbols.json')) {
		const rawJson = readFileSync('symbols.json')
		const parsedJson = JSON.parse(rawJson.toString())

		const { date } = parsedJson
		const currentDate = new Date().toISOString().slice(0, 10)

		if (currentDate > date || date === undefined) {
			const symbolsArray = await scrape()

			parsedJson.date = currentDate
			// Redundancy; if the scraper runs into an error, leave the symbols as is
			parsedJson.symbols =
				symbolsArray === undefined ? parsedJson.symbols : symbolsArray

			// Serialize as JSON and write it to the file
			writeFileSync('symbols.json', JSON.stringify(parsedJson, null, 2)) // formating
		}
	} else {
		const currentDate = new Date().toISOString().slice(0, 10)

		const symbolsArray = await scrape()

		const json = {
			date: currentDate,
			symbols: symbolsArray === undefined ? [] : symbolsArray,
		}

		// Serialize as JSON and write it to the file
		writeFileSync('symbols.json', JSON.stringify(json, null, 2)) // formating
	}
}
