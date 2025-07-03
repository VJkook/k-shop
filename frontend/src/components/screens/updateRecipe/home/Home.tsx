import React, {FC} from 'react'
import Hero from '@/screens/updateRecipe/hero/Hero'

interface id {
    id: number
}

const Home: FC = ({id}) => {
    return (
        <Hero id={id}/>
    )
}

export default Home
