import Link from 'next/link'

const Navbar = () => {
	return (
		<nav>
			<h4>Stock Ticker</h4>
			<Link href='/'>Stocks</Link>
			<Link href='/about'>About</Link>
		</nav>
	)
}

export default Navbar
