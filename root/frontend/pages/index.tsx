import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import io, { Socket } from 'socket.io-client'
import { useState, useEffect, use } from 'react'

const inter = Inter({ subsets: ['latin'] })

interface Stock {
	ticker: string
	resultsCount: number
	results: {
		c: number
		h: number
		l: number
		n: number
		o: number
		t: number
		v: number
		vw: number
	}[]
}

export const useSocket = (url: string) => {
	const [socket, setSocket] = useState<Socket | null>(null)

	useEffect(() => {
		// Creates the socket instance
		const socketIo = io(url)

		// Store it
		setSocket(socketIo)

		const cleanup = () => {
			socketIo.disconnect()
		}

		return cleanup

		// Should only run once and not on every re-render
	}, [])

	return socket
}

export default function Home() {
	const API_URL = process.env.NEXT_PUBLIC_API_URL

	const socket = useSocket(`${API_URL}`)

	const [stocks, setStocks] = useState<Stock[]>([])

	useEffect(() => {
		if (socket) {
			socket.emit('initialize', () => {
				console.log('initialize')
			})

			// Recieves the initial content
			socket.on('content', (content) => {
				if (stocks.length === 0) {
					const { data } = content.data
					setStocks(data)
				}
			})

			// Recieves the updated content
			socket.on('update-content', (content) => {
				setStocks(content.data)
			})
		}
		// Runs on render and when socket changes
	}, [socket])

	return (
		<>
			<Head>
				<title>Stock Ticker | Home</title>
				<meta name='keywords' content='stocks' />
			</Head>
			<div>
				<h1>Home</h1>
				<p>Stock prices are updated regularly, every 2 minutes.</p>
				<p>
					Displays the High, Low, and Close prices of the 5 most popular stocks
					for the current or last trade day.
				</p>
			</div>
		</>
	)
}
