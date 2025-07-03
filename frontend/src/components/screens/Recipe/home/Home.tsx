import React, {FC, useRef} from 'react'
import Meta from '@/utils/meta/Meta'
import Hero from '@/screens/Recipe/hero/Hero'
import styles from './Home.module.scss'
import {useRouter} from 'next/router'
import Link from 'next/link'

interface params {
    id: number
}

const Home: FC = ({id}) => {
    return (
        <Hero id={id}/>
    )
}

export default Home
