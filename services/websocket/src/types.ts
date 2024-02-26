export type Stock = {
    symbol: string,
    name: string,
    last_price: number,
    change: string,
    change_percent: string,
    volume: string,
    market_cap: string
}

export type StockHistory = {
    price: number, 
    price_timestamp: Date, // node-pg will parse timestamp to Date
    
}