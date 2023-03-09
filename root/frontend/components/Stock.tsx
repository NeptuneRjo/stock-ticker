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

	const price = ['c', 'h', 'l']

	const [priceSelector, setPriceSelector] = useState('h')

	const data = {
		labels: get2MinuteIntervals(
			stock.results.map((stock) => stock[priceSelector]).length
		).reverse(),
		datasets: [
			{
				label: 'Price in USD',
				data: stock.results.map((stock) => stock[priceSelector]).reverse(),
				borderColor: '#eeeeee',
				backgroundColor: '#0d47a1',
			},
		],
	}

	return (
		<>
			<Line datasetIdKey='stock-price-history' data={data} />
			<div>
				<h4>{stock.ticker}</h4>
				<h6>${stock.results[0].c} - Current Price</h6>
				<select
					name='dropdown'
					value={priceSelector}
					onChange={(e) => setPriceSelector(e.target.value)}
				>
					{price.map((price) => (
						<option value={price}>{price}</option>
					))}
				</select>
			</div>
		</>
	)
}

export default Stock
