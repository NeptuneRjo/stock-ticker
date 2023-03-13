import { StockInterface } from '@/types'
import { Line } from 'react-chartjs-2'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js'
import { useState } from 'react'
import styles from '@/styles/Stock.module.css'

function get2MinuteIntervals(intervalLength: number) {
	const now = new Date()
	const currentMinute = now.getMinutes()
	const currentHour = now.getHours()
	const intervals = []

	for (let i = currentMinute; i >= 0; i -= 2) {
		intervals.push(currentHour + ':' + (i < 10 ? '0' + i : i))
	}

	for (let i = intervalLength; i >= 0; i -= 2) {
		intervals.push(currentHour - 1 + ':' + (i < 10 ? '0' + i : i))
	}

	return intervals
}

const Stock = ({ stock }: { stock: StockInterface }) => {
	ChartJS.register(
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		Title,
		Tooltip,
		Legend
	)

	const price = [
		{ text: 'Close', value: 'c' },
		{ text: 'High', value: 'h' },
		{ text: 'Low', value: 'l' },
	]

	const [priceSelector, setPriceSelector] = useState('h')

	const data = {
		labels: get2MinuteIntervals(stock.results.length).reverse(),
		datasets: [
			{
				label: 'Price in USD',
				data: stock.results
					.map((stock) => stock[priceSelector].toFixed(2))
					.reverse(),
				borderColor: '#2da2ec',
				backgroundColor: '#2da2ec',
				pointRadius: 0.1,
				pointHoverRadius: 1,
			},
		],
	}

	return (
		<div className={styles.main}>
			<Line
				className={styles.graph}
				datasetIdKey='stock-price-history'
				data={data}
			/>
			<div className={styles.content}>
				<h4>{stock.ticker}</h4>
				<h5>${stock.results[0].c} - Current Price</h5>
				<select
					name='dropdown'
					className={styles.select}
					value={priceSelector}
					onChange={(e) => setPriceSelector(e.target.value)}
				>
					{price.map((price) => (
						<option value={price.value}>{price.text}</option>
					))}
				</select>
			</div>
		</div>
	)
}

export default Stock
