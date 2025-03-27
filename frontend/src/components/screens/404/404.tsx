import React, { FC } from 'react'
import styles from '@/components/screens/404/404.module.scss'
import Link from 'next/link'
import Meta from '@/utils/meta/Meta'

const Error: FC = () => {
	return (
		<div className={styles.wrapper}>
			<div className={styles.container}>
				<div className={styles.text}>
					<h2>
						<span>Ошибка</span> 404
					</h2>
					<h3>
						Упс! Страница, которую вы запрашиваете, не существует. Возможно она
						устарела, была удалена, или был введен неверный адрес в адресной
						строке.
					</h3>
				</div>
				<Link href="/">
					<button>Перейти на главную</button>
				</Link>
			</div>
		</div>
	)
}

export default Error
