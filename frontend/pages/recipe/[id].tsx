import {useRouter} from "next/router";
import Cake from "@/screens/product/hero/Cake";
import Home from "@/screens/Recipe/home/Home";

const Id = () => {
    const router = useRouter()
    const {id} = router.query
    return (
        <Home id={id} />
    )
};

export default Id;
