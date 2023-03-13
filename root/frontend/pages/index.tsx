import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import io, { Socket } from 'socket.io-client'
import { useState, useEffect, use } from 'react'
import { StockInterface } from '@/types'
import Stock from '@/components/Stock'

const inter = Inter({ subsets: ['latin'] })

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

	const [stocks, setStocks] = useState<StockInterface[]>([])

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
			<div className={styles.hero}>
				<h1 className={styles.title}>Home</h1>
				<p>
					Displays the High, Low, and Close prices of the 5 most popular stocks
					for the current or last trade day. <br />
					<span className={styles.small}>
						Stock prices are updated regularly, every 2 minutes.
					</span>
				</p>
			</div>

			<div className={styles.content}>
				<h3>Today's Top 5</h3>
				<div className={styles.grid}>
					{stocks.map((stock, key) => (
						<Stock stock={stock} key={key} />
					))}
				</div>
			</div>
		</>
	)
}
