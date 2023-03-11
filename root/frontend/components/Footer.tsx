import Link from 'next/link'
import styles from '@/styles/Footer.module.css'

const Footer = () => {
	return (
		<footer className={styles.footer}>
			<p>
				Copyright 2023{' '}
				<Link className={styles.link} href='https://github.com/neptunerjo'>
					NeptuneRjo
				</Link>
			</p>
		</footer>
	)
}

export default Footer
