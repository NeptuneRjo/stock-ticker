import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import updateSymbolsJson from './global/scraper'
import fetchContent from './global/fetchContent'
import cron from 'node-cron'
import cache from 'memory-cache'
import cors from 'cors'

import 'dotenv/config'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: ['http://localhost:3000'],
	},
})

/* <-- MIDDLEWARE --> */
app.use(
	cors({
		origin: ['http://localhost:3000'],
	})
)

updateSymbolsJson()

// Fetch the content every 2 minutes
cron.schedule('*/2 * * * *', () => {
	fetchContent()
})

/* <-- ROUTES --> */

const port = 8000 || process.env.PORT

io.on('connection', (socket) => {
	console.log('A user has connected')
	const content = cache.get('content')

	if (content !== null) {
		socket.emit('content', content)
	}

	socket.on('disconnect', () => {
		console.log('user disconnected')
	})
})

server.listen(port, () => {
	console.log(`Server sucessfully started and listening on port ${port}`)
})

// Export io to be used in other files
export { io }
