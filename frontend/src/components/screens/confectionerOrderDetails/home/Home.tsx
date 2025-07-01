import React, {FC, useRef} from 'react'
import Meta from '@/utils/meta/Meta'
import OrderPage from '@/screens/confectionerOrderDetails/hero/Hero'
import styles from './Home.module.scss'
import {useRouter} from 'next/router'
import Link from 'next/link'
import Hero from "@/screens/konditerOrders/hero/Hero";

const Home: FC = () => {
    const router = useRouter()
    const {id} = router.query
    return (
        OrderPage({id: id})
    )

}

export default Home
