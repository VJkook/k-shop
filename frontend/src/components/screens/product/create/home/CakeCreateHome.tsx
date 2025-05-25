import React, { FC, useRef } from 'react'
import Meta from '@/utils/meta/Meta'
import Orders from '@/screens/orders/hero/Orders'
import styles from './Home.module.scss'
import { useRouter } from 'next/router'
import Link from 'next/link'
import CakeCreate from "@/screens/product/create/hero/CreateCake";

const CakeCreateHome: FC = () => {
	const nextBlockRef = useRef<HTMLDivElement>(null)
	const router = useRouter()
	const pathSegments = router.asPath.split(`/`).filter(Boolean)
	return (
		<Meta title="Создание товара" description="Создание товара" image="logo_preview.png">
			<div className={styles.wrapper}>
				<div className={styles.bread_crumbs}>
					<Link href={'/'}>Главная страница</Link> {'>'} <Link href={'/products/create'}>Создание товара</Link>
				</div>
				<CakeCreate/>



			</div>
		</Meta>
	)
}

export default CakeCreateHome
