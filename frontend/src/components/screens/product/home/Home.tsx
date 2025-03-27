import React, { FC, useRef } from 'react'
import Meta from '@/utils/meta/Meta'
import Hero from '@/screens/product/hero/Hero'
import styles from './Home.module.scss'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Home: FC = () => {
	const nextBlockRef = useRef<HTMLDivElement>(null)
	const router = useRouter()
	const pathSegments = router.asPath.split(`/`).filter(Boolean)
	return (
		<Meta title="Продукт" description="Продукт" image="logo_preview.png">
			<div className={styles.wrapper}>
				<div className={styles.bread_crumbs}>
					<Link href={'/'}>Главная страница</Link> {'>'} <Link href={'/constructor'}>Продукт</Link>
				</div>
				<Hero/>


				
			</div>
		</Meta>
	)
}

export default Home
