import React, { FC, useRef } from 'react'
import Meta from '@/utils/meta/Meta'
import styles from './Home.module.scss'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Basket from "@/screens/basket/hero/Basket";

const BasketHome: FC = () => {
	const nextBlockRef = useRef<HTMLDivElement>(null)
	const router = useRouter()
	const pathSegments = router.asPath.split(`/`).filter(Boolean)
	return (
		<Meta title="корзина" description="корзина" image="logo_preview.png">
			<div className={styles.wrapper}>
				<div className={styles.bread_crumbs}>
					<Link href={'/'}>Главная страница</Link> {'>'} <Link href={'/constructor'}>корзина</Link>
				</div>
				<Basket/>



			</div>
		</Meta>
	)
}

export default BasketHome
