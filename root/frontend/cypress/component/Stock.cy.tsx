import Stock from '@/components/Stock'

describe('Stock.cy.tsx', () => {
	const stock = {
		ticker: 'TEST',
		resultsCount: 1,
		results: [
			{
				c: 75,
				h: 75,
				l: 73,
				n: 1,
				o: 74,
				t: 1577941200000,
				v: 135647456,
				vw: 74,
			},
		],
	}

	it('mounts', () => {
		cy.mount(<Stock stock={stock} />)
	})

	it('displays the current high price', () => {
		cy.mount(<Stock stock={stock} />)
		const testText = `$${stock.results[0].c} - Current Price`

		cy.get('[data-cy=stock-content] > h5').should('have.text', testText)
	})

	it('displays the stock symbol', () => {
		cy.mount(<Stock stock={stock} />)

		cy.get('[data-cy=stock-content] > h4').should('have.text', stock.ticker)
	})

	it('displays the select dropdown, default on high', () => {
		cy.mount(<Stock stock={stock} />)

		cy.get('[data-cy=stock-select]').should('be.visible')
		cy.get('[data-cy=stock-select] option:selected')
			.invoke('text')
			.should('eq', 'High')

		cy.get('[data-cy=stock-option]').should('be.visible')
	})

	it('has the correct values for the dropdown', () => {
		cy.mount(<Stock stock={stock} />)

		cy.get('[data-cy=stock-select] option:selected').should('have.value', 'h')

		cy.get('[data-cy=stock-select]').select('c')
		cy.get('[data-cy=stock-select] option:selected').should('have.value', 'c')

		cy.get('[data-cy=stock-select]').select('l')
		cy.get('[data-cy=stock-select] option:selected').should('have.value', 'l')
	})

	it('displays the line chart', () => {
		cy.mount(<Stock stock={stock} />)

		cy.get('[data-cy=stock-graph]').should('be.visible')
	})
})
