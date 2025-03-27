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
			</div>
		</div>
	)
}

export default Hero
