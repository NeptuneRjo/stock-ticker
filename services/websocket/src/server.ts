import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cache from 'memory-cache'
import cors from 'cors'
import { Client } from 'pg'

import 'dotenv/config'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
	cors: {
		origin: ['http://localhost:3000', 'http://frontend_container:3000'],
		credentials: true,
		methods: ['GET', 'POST'],
	},
})

/* <-- MIDDLEWARE --> */
app.use(
	cors({
		origin: ['http://localhost:3000', 'http://localhost:4000', 'http://frontend_container:3000'],
		credentials: true,
		methods: ['GET', 'POST'],
	})
)

const port = process.env.PORT || 8000

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

const client = new Client()

app.get('/', (req, res) => console.log("Hello world"))

app.get("/emitt-event", async (req: express.Request, res: express.Response) => {
	try {
		await client.connect()
	
		const results = await client.query('SELECT * FROM stocks')

		if (results.rows !== null) {
			cache.put('content', results.rows)
			io.emit('content', { data: results.rows })
		}

		await client.end()
	} catch (error) {
		console.error(error)
	}
})

server.listen(port, () => {
	console.log(`Server sucessfully started and listening on port ${port}`)
})

// Export io to be used in other files
export { io }
