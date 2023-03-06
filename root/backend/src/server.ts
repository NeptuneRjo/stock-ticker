import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import updateSymbolsJson from './global/scraper'

import 'dotenv/config'

import axios from 'axios'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

/* <-- MIDDLEWARE --> */
updateSymbolsJson()

/* <-- ROUTES --> */

const port = 8000 || process.env.PORT

io.on('connection', (socket) => {
	console.log('A user has connected')

	socket.on('disconnect', () => {
		console.log('user disconnected')
	})
})

server.listen(port, () => {
	console.log(`Server sucessfully started and listening on port ${port}`)
})

// Export io to be used in other files
export { io }
