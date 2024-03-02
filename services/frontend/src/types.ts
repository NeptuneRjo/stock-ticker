export type Stock = {
    symbol: string,
    name: string,
    last_price: number,
    change: string,
    change_percent: string,
    volume: string,
    market_cap: string,
    history: {
        price: number,
        timestamp: Date
    }[]
}