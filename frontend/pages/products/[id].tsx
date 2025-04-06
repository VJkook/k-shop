import {useRouter} from "next/router";
import Cake from "@/screens/product/hero/Cake";

const Id = () => {
    const router = useRouter()
    const {id} = router.query
    return (
        Cake({id: id})
    )
};

export default Id;
