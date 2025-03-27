import { FC } from 'react'
import styles from './Heading.module.scss'
import { motion } from 'framer-motion'
import { staggerContainer, textVariant, textVariant2 } from '@/utils/motion'

interface IHeading {
	titlePart1: string
	titlePart2: string
	className?: string
}

const Heading: FC<IHeading> = ({ titlePart1, titlePart2, className }) => {
	return (
		<motion.div
			variants={staggerContainer()}
			initial="hidden"
			whileInView="show"
			viewport={{ once: false, amount: 0.25 }}
		>
			<motion.h1
				variants={textVariant(1.4)}
				className={`text-text mb-14 font-bold ${styles.title} ${className}`}
			>
				{titlePart1}{' '}
				<motion.span variants={textVariant(1.5)} className="text-primary">
					{titlePart2}
				</motion.span>
			</motion.h1>
		</motion.div>
	)
}

export default Heading
