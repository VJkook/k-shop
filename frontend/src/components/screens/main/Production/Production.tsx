import React, { FC, useEffect, useRef } from 'react'
import styles from './Production.module.scss'
import cn from 'classnames'
import Image from 'next/image'
import Logo1 from '../../../../assets/img/construct3.jpg'
import Cake from '../../../../assets/img/cakee3.jpg'
import { EIcons, Icon as IconInstance } from '../../../../assets/icons/icon'
import { propoData } from '@/screens/main/hero/propo-data'

interface PropoData {
	img: React.ReactNode | null
	title: string
}

const Production: FC = () => {
	return (
		<div className={cn(styles.base, 'wrapper')}>
			<div className={styles.main_container}>
				<div>
					<div className={styles.text}>
						<h2>Собрать торт самому!</h2>
					</div>
					<div className={styles.text}>
						<h3>
							Вы можете выбрать готовое изделие или собрать его сами!
							<br /> Мы предоставляем большой выбор коржей и начинок
						</h3>
					</div>
				</div>
				<div className={styles.row}>
					<div className={styles.card}>
					<Image src={Logo1} alt='Cake' className={styles.img}/>
						<div className={styles.text}>
							<p>Собрать торт</p>
						</div>
					</div>
					<div className={styles.card}>
					<Image src={Cake} alt='Cake' className={styles.img}/>
						<div className={styles.text}>
							<p>Готовое изделие</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Production
