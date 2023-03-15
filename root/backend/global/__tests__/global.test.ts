import type * as Util from '../util'
const {
	readJsonFile,
	writeJsonFile,
	getEstDate,
	getLastFridayOf,
	getYesterday,
} = jest.requireActual<typeof Util>('../util')

import type * as Api from '../api'
const { getStock, getData, fetchContent } =
	jest.requireActual<typeof Api>('../api')

import axios from 'axios'
import fs from 'fs'

jest.mock('axios')

describe('util', () => {
	test('getEstDate returns the right date', async () => {
		const date = new Date()
		let offset = -300 // Timezone offset for EST in minutes.
		let testDate = new Date(date.getTime() + offset * 60 * 1000)
			.toISOString()
			.slice(0, 10)

		const estDate = await getEstDate()

		expect(estDate).toEqual(testDate)
	})

	test('readJsonFile reads the file', async () => {
		const testFilePath = './test-file.json'
		const testData = { foo: 'bar', baz: 123 }

		fs.writeFileSync(testFilePath, JSON.stringify(testData))

		const parsedJson = await readJsonFile(testFilePath)

		expect(parsedJson).toEqual(testData)

		fs.unlinkSync(testFilePath)
	})

	test('writeJsonFile writes the file', async () => {
		const testFilePath = './test-file.json'
		const testData = { foo: 'bar', baz: 123 }

		await writeJsonFile(testFilePath, testData)

		const json = fs.readFileSync(testFilePath)
		const parsedJson = JSON.parse(json.toString())

		expect(parsedJson).toEqual(testData)

		fs.unlinkSync(testFilePath)
	})

	test('getLastFridayOf returns the last friday', async () => {
		const testDay = '2023-03-15'
		const testFriday = '2023-03-10'

		const lastFriday = await getLastFridayOf(testDay)

		expect(lastFriday).toEqual(testFriday)
	})

	test('getYesterday returns yesterday', async () => {
		const testDay = '2023-03-15'
		const testYesterday = '2023-03-14'

		const yesterday = await getYesterday(testDay)

		expect(yesterday).toEqual(testYesterday)
	})
})

describe('fetchContent', () => {
	const testData = {
		ticker: 'TEST',
		resultsCount: 5,
		results: [
			{
				c: 75,
				h: 75,
				l: 73,
				n: 1,
				o: 74,
				t: 1577941200000,
				v: 135647456,
				vw: 74,
			},
		],
	}

	test('getStock returns the response', async () => {
		;(axios.get as jest.Mock).mockResolvedValue({
			data: testData,
		})

		const testDate = '2023-03-15'
		const testSymbol = 'TEST'

		const response = await getStock(testDate, testSymbol, testDate)

		expect(response).toEqual(testData)
	})

	test('getData returns an array with the data', async () => {
		;(axios.get as jest.Mock).mockResolvedValue({
			data: testData,
		})

		const testDate = '2023-03-15'
		const testSymbol = 'TEST'

		const response = await getData(testDate, [testSymbol])

		expect(response).toEqual([testData])
	})
})
