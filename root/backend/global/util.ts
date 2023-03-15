import { readFileSync, writeFileSync } from 'fs'
import axios from 'axios'

export const getEstDate = async () => {
	const date = new Date()
	let offset = -300 // Timezone offset for EST in minutes.
	let estDate = new Date(date.getTime() + offset * 60 * 1000)
		.toISOString()
		.slice(0, 10)

	return estDate
}

export const readJsonFile = async (path: string) => {
	try {
		const rawJson = readFileSync(path)
		const parsedJson = JSON.parse(rawJson.toString())
		return parsedJson
	} catch (error) {
		console.log(error)
		return null
	}
}

export const writeJsonFile = async (path: string, jsonData: object) => {
	try {
		// Serialize as JSON and write it to the file
		writeFileSync(path, JSON.stringify(jsonData, null, 2)) // formating
	} catch (error) {
		console.log(error)
	}
}

export const getLastFridayOf = async (date: string) => {
	let d = new Date(date)
	let day = d.getDay()
	let diff = day <= 5 ? 7 - 5 + day : day - 5

	d.setDate(d.getDate() - diff)
	d.setHours(0)
	d.setMinutes(0)
	d.setSeconds(0)

	const lastFriday = new Date(d.getTime()).toISOString().slice(0, 10)

	return lastFriday
}

export const getYesterday = async (date: string) => {
	// sets the date-time to date-00:00:00
	const d = new Date(date)

	const yesterday = new Date(d)
	yesterday.setDate(d.getDate() - 1)

	return yesterday.toISOString().slice(0, 10)
}
