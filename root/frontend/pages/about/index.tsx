import Head from 'next/head'
import styles from '@/styles/About.module.css'

const About = () => {
	return (
		<>
			<Head>
				<title>Stock Ticker | About</title>
				<meta name='keywords' content='stocks' />
			</Head>
			<div className={styles.section}>
				<h4 className={styles.title}>About Stock Ticker</h4>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit
					suscipit harum dolorum tempora, animi esse velit, iusto debitis illum
					labore quasi similique, doloribus cupiditate itaque eaque earum
					exercitationem. Quos, laudantium. Nobis error dolorem expedita libero,
					assumenda magnam officiis ad aut, odit, earum nam enim. Dicta nam
					illum vel nisi tenetur quibusdam facilis. Exercitationem, alias
					incidunt quasi quaerat sapiente dicta autem!
				</p>
			</div>
			<div className={styles.section}>
				<h4 className={styles.title}>Our Mission</h4>
				<p>
					Lorem ipsum dolor sit, amet consectetur adipisicing elit. Possimus
					doloremque praesentium saepe deserunt hic quod neque, dignissimos,
					minus fugiat eos dolorum? Ea iusto doloremque dolorum vitae temporibus
					laborum ipsam sed.
				</p>
			</div>
			<div className={styles.section}>
				<h4 className={styles.title}>Something Else</h4>
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque aliquam
					inventore cum ad maxime totam magni iure, odit itaque. Magnam tenetur
					cumque quibusdam illum nobis possimus dolorum voluptate, assumenda
					non?
				</p>
				<p>
					Lorem ipsum dolor sit, amet consectetur adipisicing elit. Numquam
					dolores officiis iste, quaerat sunt sed cupiditate! Iste temporibus
					consectetur repellendus veniam necessitatibus magnam mollitia voluptas
					corrupti doloribus, iusto accusamus omnis!
				</p>
			</div>
		</>
	)
}

export default About
