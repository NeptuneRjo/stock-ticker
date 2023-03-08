import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
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
