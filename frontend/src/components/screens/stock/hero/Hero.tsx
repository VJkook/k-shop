import React, { FC } from 'react'
import styles from './Hero.module.scss'
import cn from 'classnames'
import Image from 'next/image'
import Logo1 from '../../../../assets/img/first1.jpg'
import Birthday from '../../../../assets/img/birthday1.jpg'
import { propoData } from '@/screens/main/hero/propo-data'

interface PropoData {
	img: React.ReactNode | null
	title: string
}

const Hero: FC = () => {
	return (
		<div className={cn(styles.base, 'wrapper')}>
			<div className={styles.main_container}>
				<div className={styles.column}>
					<div className={styles.row}>
						<div className={styles.circle1}>
							<div className={styles.circle2}>
							<Image src={Logo1} alt='Cake' className={styles.img}/>
							</div>
						</div>
						<div className={styles.text_block}>
							<div className={styles.text}>
								<h1>Получи скидку при первом заказе!</h1>
								<p>Для каждого нового покупателя мы
									предоставляем скидку в 10%</p>
							</div>
							<button>Сделать заказ</button>
						</div>
					</div>
					<div className={styles.row}>
						<div className={styles.text_block}>
							<div className={styles.text}>
								<h1>Получи скидку в День рождения!</h1>
								<p>В твой День рождения мы предоставляем скидку в 10%</p>
							</div>
							<button>Сделать заказ</button>
						</div>
						<div className={styles.circle1}>
							<div className={styles.circle2}>
							<Image src={Birthday} alt='Cake' className={styles.img}/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Hero
