import Link from 'next/link'
import styles from '@/styles/Navbar.module.css'

const Navbar = () => {
	return (
		<nav className={styles.main}>
			<h4 className={styles.title}>Stock Ticker</h4>
			<Link className={styles.link} href='/'>
				Stocks
			</Link>
			<Link className={styles.link} href='/about'>
				About
			</Link>
		</nav>
	)
}

export default Navbar
