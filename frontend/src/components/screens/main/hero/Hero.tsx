import React, { FC } from 'react'
import styles from './Hero.module.scss'
import cn from 'classnames'
import { propoData } from '@/screens/main/hero/propo-data'

interface PropoData {
	img: React.ReactNode | null
	title: string
}

const Hero: FC = () => {
	return (
		<div className={cn(styles.base, 'wrapper')}>
			<div className={styles.main_container}>
				<h1>Наша продукция</h1>
				<div className={styles.row}>
					{propoData?.map((item: PropoData, index) => (
						<div className={styles.card} key={index}>
							<div className={styles.box1}>
								<div className={styles.box2}>{item.img}</div>
							</div>
							<div className={styles.text}>
								<p>{item.title}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default Hero
