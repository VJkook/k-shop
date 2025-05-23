import React, { FC, useRef } from 'react'
import Meta from '@/utils/meta/Meta'
import CakeDesignerForm from '@/screens/constructor/hero/CakeDesignerForm'
import styles from './Home.module.scss'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Home: FC = () => {
	const nextBlockRef = useRef<HTMLDivElement>(null)
	const router = useRouter()
	const pathSegments = router.asPath.split(`/`).filter(Boolean)
	return (
		<Meta title="Каталог" description="Каталог" image="logo_preview.png">
			<div className={styles.wrapper}>
				<div className={styles.bread_crumbs}>
					<Link href={'/'}>Главная страница</Link> {'>'} <Link href={'/constructor'}>Конструктор торта</Link>
				</div>
				<CakeDesignerForm />
			</div>
		</Meta>
	)
}

export default Home
