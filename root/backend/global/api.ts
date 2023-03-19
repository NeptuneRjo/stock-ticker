import axios from 'axios'
import { existsSync, readFileSync } from 'fs'
import cache from 'memory-cache'
import { getLastFridayOf, getEstDate, getYesterday } from './util'

/**
 * Retrieves the stock information for the given date;
 * If date2 is included, that will be the start date for the retrieval
 *
 */
export const getStock = async (
	date: string,
	symbol: string,
	date2: string | undefined = undefined
) => {
	const API_KEY = process.env.API_KEY

	try {
		const res = await axios.get(
			`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/2/minute/${
				date2 ? date2 : date
			}/${date}?adjusted=true&sort=desc&limit=120&apiKey=${API_KEY}`
		)
		const { ticker, resultsCount, results } = res.data

		return { ticker, resultsCount, results }
	} catch (error) {
		throw Error(error as string)
	}
}

export const getData = async (
	date1: string,
	symbols: any,
	date2: string | undefined = undefined
) => {
	let data: { ticker: string; resultsCount: number; results: [] }[] = []

	for (let i = 0; i < symbols.length; i++) {
		try {
			const res = await getStock(date1, symbols[i], date2)
			data.push(res)
		} catch (error) {
			throw Error(error as string)
		}
	}

	return data
}

export const fetchContent = async (io: any) => {
	const date = await getEstDate()
	const day = new Date(date).getDay()

	const lastFriday = await getLastFridayOf(date)
	const yesterday = await getYesterday(date)

	try {
		const symbols = ['TSLA', 'BAC', 'AMD', 'F', 'SWN']

		let data: { ticker: string; resultsCount: number; results: [] }[] = []

		switch (day) {
			case 0:
			case 6: {
				data = await getData(lastFriday, symbols)
				break
			}
			case 1: {
				data = await getData(date, symbols, lastFriday)
				break
			}
			default: {
				data = await getData(date, symbols, yesterday)
				break
			}
		}

		if (data.length > 0) {
			// Emit the data to users already connected
			io.emit('update-content', { data })

			// Cache the data for users that connect in between fetch
			// periods
			cache.put('content', { data })
		}
	} catch (error) {
		console.log('fetch content error', error)
	}
}
