import {FC} from 'react'
import OrderPage from '@/screens/confectionerOrderDetails/hero/Hero'
import {useRouter} from 'next/router'

const Home: FC = () => {
    const router = useRouter()
    const {id} = router.query
    return (
        OrderPage({id: id})
    )

}

export default Home
