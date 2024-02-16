import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import cron from 'node-cron'
import { Stock } from './types'
import { parseStockHtmlElements } from './scraper/htmlParsing'
import { fillDatabaseWithStocks } from './data/addStocks'
import { scrapeStocks } from './scraper/scraper'
import client from './data/initializePostgres'

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
		const query = 'SELECT * FROM stocks'
		const results = await client.query(query)
		
		socket.emit('initialize:content:client', results.rows)
	})
	
	socket.on('disconnect', () => {
		console.log('user disconnected')
	})
})

const updateClients = async () => {
	const query = 'SELECT * FROM stocks'
	const results = await client.query(query)
	
	io.emit('update:content:client', results.rows)
}

// 1-minute intervals
const scrapeTask = cron.schedule('* */1 * * *', async () => {
	const stockHtmlElements: string[] = await scrapeStocks()
	const stocks: Stock[] = await parseStockHtmlElements(stockHtmlElements)

	await fillDatabaseWithStocks(stocks)
	await updateClients()
})
scrapeTask.start()

server.listen(port, () => {
	console.log(`Server sucessfully started and listening on port ${port}`)
})

// Export io to be used in other files
export { io }
