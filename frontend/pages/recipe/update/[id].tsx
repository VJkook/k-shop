import Home from '@/screens/createRecipe/home/Home'
import {useRouter} from "next/router";

export default function StockPage() {
    const router = useRouter()
    const {id} = router.query

    return <Home id={id}/>
}
