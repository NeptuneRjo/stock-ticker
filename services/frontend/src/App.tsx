import React from 'react';
import './App.css';
import { Stock } from './types';
import io, { Socket } from 'socket.io-client'

function App() {
  const endpoint = process.env.REACT_APP_WEBSOCKET_ENDPOINT
  const socket: Socket = io(endpoint as string)
  
  const [stocks, setStocks] = React.useState<Stock[]>([])

  React.useEffect(() => {
    socket.connect()
    
    	// **:**:client/server denotes the recipient
    socket.emit('initialize:content:server')

    // Prevent uneccessary updating
    if (stocks.length === 0) {
      socket.on('initialize:content:client', (data: Stock[]) => {
        setStocks(data)
      })    
    }

    socket.on('update:content:client', (data: Stock[]) => {
      setStocks(data)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div className="app">
      <div>
        <h1>Home</h1>
        <p>
          Displays the prices of 100 of the current most active stocks
          <br />
          <span>
            Stock prices are updated every minute.
          </span>
        </p>
      </div>
      {stocks.length === 0 ? (
        <div className='loader'>Loading...</div>
      ) : (
        <table>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Last Price (USD)</th>
            <th>Change</th>
            <th>Percent Change</th>
            <th>Volume</th>
            <th>Market Cap</th>
          </tr>
          {stocks.map((stock: Stock, key: number) => (
              <tr key={key}>
                <td>{stock.symbol}</td>
                <td>{stock.name}</td>
                <td>{stock.last_price}</td>
                <td>{stock.change}</td>
                <td>{stock.change_percent}</td>
                <td>{stock.volume}</td>
                <td>{stock.market_cap}</td>
              </tr>
          ))}
        </table>
      )}
    </div>
  );
}

export default App;
