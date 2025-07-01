import React, { FC, useRef } from 'react'
import Meta from '@/utils/meta/Meta'
import Hero from '@/screens/confectionerOrders/hero/Hero'
import styles from './Home.module.scss'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Home: FC = () => {
	const nextBlockRef = useRef<HTMLDivElement>(null)
	const router = useRouter()
	const pathSegments = router.asPath.split(`/`).filter(Boolean)
	return (

				<Hero />

	)
}

export default Home
