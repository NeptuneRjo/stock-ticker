import axios from 'axios'
import { io } from '../server'
import { existsSync, readFileSync } from 'fs'
import cache from 'memory-cache'

export function getLastFridayOf(date: string) {
	let d = new Date(date)
	let day = d.getDay()
	let diff = day <= 5 ? 7 - 5 + day : day - 5

	d.setDate(d.getDate() - diff)
	d.setHours(0)
	d.setMinutes(0)
	d.setSeconds(0)

	return d.getTime()
}

export async function getStock(date: string, symbol: string) {
	const API_KEY = process.env.API_KEY

	try {
		const res = await axios.get(
			`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/5/minute/${date}/${date}?adjusted=true&sort=desc&limit=120&apiKey=${API_KEY}`
		)
		const { ticker, resultsCount, results } = res.data

		return { ticker, resultsCount, results }
	} catch (error) {
		throw Error(error as string)
	}
}

export default async function fetchContent() {
	const currentDate = new Date().toISOString().slice(0, 10)
	const lastFriday = new Date(getLastFridayOf(currentDate))
		.toISOString()
		.slice(0, 10)
	const currentDayNumber = new Date().getDate()

	if (existsSync('symbols.json')) {
		try {
			const rawJson = readFileSync('symbols.json')
			const parsedJson = JSON.parse(rawJson.toString())

			const { symbols } = parsedJson

			let data: { ticker: string; resultsCount: number; results: [] }[] = []

			if (currentDayNumber === (6 || 7)) {
				for (let i = 0; i < symbols.length; i++) {
					try {
						const res = await getStock(lastFriday, symbols[i])
						data.push(res)
					} catch (error) {
						throw Error(error as string)
					}
				}
			} else {
				for (let i = 0; i < symbols.length; i++) {
					try {
						const res = await getStock(currentDate, symbols[i])
						data.push(res)
					} catch (error) {
						throw Error(error as string)
					}
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
	} else {
		console.log('does not exist')
	}
}
