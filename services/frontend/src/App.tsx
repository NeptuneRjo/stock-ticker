import React from 'react';
import './App.css';
import { Stock } from './types';
import io, { Socket } from 'socket.io-client'
import { StockChart } from './components'
import { applyCountToArray } from './utilities/pagination'
import ReactPaginate from 'react-paginate';

function App() {
  const endpoint = process.env.REACT_APP_WEBSOCKET_ENDPOINT
  const socket: Socket = io(endpoint as string)
  
  const [stocks, setStocks] = React.useState<Stock[]>([])

  const [offset, setOffset] = React.useState<number>(0)
  const [count, setCount] = React.useState<number>(24)

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

  const displayStocks = applyCountToArray(stocks, count)

  return (
    <div className="app">
      <div className='hero'>
        <h1 className='title'>Market Watch</h1>
        <p>
          Displays the prices of the {stocks.length} most active stocks
          <br />
          Stock prices are updated every minute.
        </p>
      </div>
      {(stocks.length === 0 && displayStocks.length === 0) ? (
        <div className='loader'>Loading...</div>
      ) : (
        <div className='content'>
          <div className='controls'>
            <select className="offset" onChange={({ target }) => setCount(Number(target.value))}>
              <option value={24}>Show 24 stocks</option>
              <option value={48}>Show 48 stocks</option>
              <option value={96}>Show 96 stocks</option>
              <option value={192}>Show 192 stocks</option>
              <option value={stocks.length}>Show all stocks</option>
            </select>
            <ReactPaginate 
              breakLabel="..." 
              nextLabel=">" 
              onPageChange={({ selected }) => setOffset(selected)}
              pageRangeDisplayed={displayStocks.length}
              pageCount={displayStocks.length}
              previousLabel="<"
              renderOnZeroPageCount={null}
              containerClassName='paginate'
              activeClassName='paginate-active'
            />
          </div>
          <div className="grid">
            {displayStocks[offset].map((stock, key) => (
              <StockChart stock={stock} key={key} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App;
