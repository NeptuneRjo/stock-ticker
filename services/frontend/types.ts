export interface StockInterface {
	ticker: string
	resultsCount: number
	results: {
		// Set the key as string so it can be accessed with bracket notation
		[c: string]: number
		h: number
		l: number
		n: number
		o: number
		t: number
		v: number
		vw: number
	}[]
}
