import React, {FC, useRef} from 'react'
import Meta from '@/utils/meta/Meta'
import OrderPage from '@/screens/adminOrderDetails/hero/OrderPage'
import styles from './Home.module.scss'
import {useRouter} from 'next/router'
import Link from 'next/link'

const Home: FC = () => {
    const router = useRouter()
    const {id} = router.query
    return (
        OrderPage({id: id})
    )
}

export default Home
