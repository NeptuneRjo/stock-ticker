import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import cron from 'node-cron'
import * as scraper from './scraping/scraper'
import * as query from './data/queries'

const app = express()
const server = http.createServer(app)

const corsOptions = {
	origin: ['http://localhost:3000', 'http://frontend_container:3000'],
	credentials: true,
	methods: ['GET', 'POST'],
}

const io = new Server(server, {
	cors: corsOptions,
})

/* <-- MIDDLEWARE --> */
app.use(cors(corsOptions))

const port = process.env.PORT || 8000

io.on('connection', (socket) => {
	// **:**:client/server denotes the recipient
	socket.on('initialize:content:server', async () => {
		const results = await query.getStocksFromDatabase()
		
		socket.emit('initialize:content:client', results)
	})
	
	socket.on('disconnect', () => {
		console.log('user disconnected')
	}) 
})

const updateClients = async () => {
	const results = await query.getStocksFromDatabase()
	
	io.emit('update:content:client', results)
}

// 1-minute intervals
const scrapeTask = cron.schedule('* */1 * * *', async () => {
	// Source: https://stackoverflow.com/a/64264859
	const marketOpen = 14 * 60 + 30 // minutes
	const marketClosed = 21 * 60 // minutes
	let now = new Date()
	let currentTime = now.getUTCHours() * 60 + now.getUTCMinutes() // Minutes since Midnight

	if(currentTime > marketOpen && currentTime < marketClosed) { 
		const stocks = await scraper.scrapeAndProcessData()
		
		await query.updateStocksInDatabase(stocks)
		await updateClients()
	}
})

server.listen(port, async () => {
	console.log(`Server sucessfully started and listening on port ${port}`)
	
	// Create tables if they dont already exist
	await query.setupStockTable()
	await query.setupStockHistoryTable()
	
	// Scrape the stocks and initialize the data in the table
	const stocks = await scraper.scrapeAndProcessData()
	await query.addStocksToDatabase(stocks)
	
	scrapeTask.start()
})

