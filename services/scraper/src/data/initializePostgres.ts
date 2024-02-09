import {Client} from 'pg'
import { initializeStockTable } from './tables/stockTable'

const client = new Client()

client.connect().then(() => {
    initializeStockTable(client)
})

export default client