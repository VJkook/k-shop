import Home from '@/screens/updateRecipe/home/Home'
import {useRouter} from "next/router";

export default function StockPage() {
    const router = useRouter()
    const {id} = router.query

    if (id == undefined) {
        return '';
    }
    return <Home id={id}/>
}
