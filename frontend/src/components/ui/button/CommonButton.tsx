import React, { FC } from 'react'
import Link from 'next/link'
import styles from './CommonButton.module.scss'

interface ButtonProps {
	href?: string
	color?: 'primary' | 'orange' | 'gray' | 'gray02' | 'ghost' | 'black'
	size?: 'l' | 'm' | 's' | 'xs' | 'fill'
	children: React.ReactNode
	className?: string
	disabled?: boolean
	type?: 'submit' | 'button' | 'reset'
	target?: '_blank' | '_self'
}

const CommonButton: FC<ButtonProps> = ({
	href,
	color = 'primary',
	size = 'm',
	children,
	disabled,
	type = 'button',
	target = '_self',
}) => {
	const classNames = [styles.button, styles[size], styles[color]].join(' ')

	return (
		<>
			{href ? (
				<Link href={href} target={target}>
					<button className={classNames} type={type} disabled={disabled}>
						<noindex>{children}</noindex>
					</button>
				</Link>
			) : (
				<button className={classNames} type={type} disabled={disabled}>
					<noindex>{children}</noindex>
				</button>
			)}
		</>
	)
}

export default CommonButton
