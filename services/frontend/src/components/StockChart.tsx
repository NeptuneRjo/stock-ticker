import React from 'react'
import { Stock } from '../types'
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

const StockChart = ({ stock }: { stock: Stock }) => {
	ChartJS.register(
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		Title,
		Tooltip,
		Legend
	)

    const { name, symbol, last_price, change_percent, history } = stock

    // Sort stock history by earliest to latest
    const sortedStockHistory = history.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) 

    const chartData = {
        labels: history.map(() => ""),
        datasets: [{
            label: "",
            data: sortedStockHistory.map(({price}) => price.toFixed(2)),
            fill: false,
            pointHoverRadius: 1,
            pointRadius: 0.2,
            backgroundColor: '#2da2ec',
            borderColor: '#2da2ec',
        }],
    }

    ChartJS.defaults.plugins.legend.display = false

    return (
        <div className='stock'>
            <div>
                <h4>{name}</h4>
                <span>{symbol}</span>
                <p>${last_price} | {change_percent}</p>
            </div>
            <div>
                <Line 
                    data={chartData}
                />
            </div>
        </div>
    )
}

export default StockChart
