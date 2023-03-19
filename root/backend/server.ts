import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { scrapeAndUpdate } from './global/scraper'
import { fetchContent } from './global/api'
import cron from 'node-cron'
import cache from 'memory-cache'
import cors from 'cors'

import 'dotenv/config'

const app = express()
const server = http.createServer(app)

const content = cache.get('content')

const io = new Server(server, {
	cors: {
		origin: ['http://localhost:3000', 'https://stock-ticker.onrender.com'],
		credentials: true,
	},
})

/* <-- MIDDLEWARE --> */
app.use(
	cors({
		origin: ['http://localhost:3000', 'https://stock-ticker.onrender.com'],
		credentials: true,
	})
)

// Run job at 12:00 at EST time
// const scheduledScrape = cron.schedule(
// 	'0 12 * * *',
// 	() => {
// 		scrapeAndUpdate()
// 	},
// 	{
// 		timezone: 'US/Eastern',
// 	}
// )

// Initialize the data on server startup
if (content === null) {
	fetchContent(io)
}

// Fetch the content every 2 minutes
const scheduledFetch = cron.schedule('*/2 * * * *', () => {
	fetchContent(io)
})

// Start the 2 minute schedule
scheduledFetch.start()

// scheduledScrape.start()

/* <-- ROUTES --> */

const port = 8000 || process.env.PORT

io.on('connection', (socket) => {
	socket.on('initialize', () => {
		const content = cache.get('content')

		if (content !== null) {
			socket.volatile.emit('content', { data: content })
		}
	})

	socket.on('disconnect', () => {
		console.log('user disconnected')
	})
})

server.listen(port, () => {
	console.log(`Server sucessfully started and listening on port ${port}`)
})

// Export io to be used in other files
export { io }
