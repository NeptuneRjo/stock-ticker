import Navbar from '@/components/Navbar'

describe('Navbar.cy.tsx', () => {
	it('mounts', () => {
		cy.mount(<Navbar />)
	})

	it('the Stocks link routes correctly', () => {
		cy.mount(<Navbar />)

		cy.get('[data-cy=navbar-stocks]')
			.should('have.attr', 'href')
			.should('include', '/')
	})

	it('the About link routes correctly', () => {
		cy.mount(<Navbar />)

		cy.get('[data-cy=navbar-about]')
			.should('have.attr', 'href')
			.should('include', '/about')
	})
})
