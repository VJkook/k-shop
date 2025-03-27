import { EIcons, Icon as IconInstance } from '../../../../assets/icons/icon'
import Image from 'next/image'
import img1 from '../../../../assets/img/pirog2.jpg'
import imgCake from '../../../../assets/img/cake3.jpg'
import imgChocolate from '../../../../assets/img/chocolate1.jpg'
import imgPie from '../../../../assets/img/pie1.jpg'
import imgDi from '../../../../assets/img/disert3.jpg'
export const propoData = [
	{
		img: <Image src={img1} alt='Cake'/>,
		title: 'Кексы и пироженные',
	},
	{
		img: <Image src={imgCake} alt='Cake'/>,
		title: 'Торты',
	},
	{
		img: <Image src={imgChocolate} alt='Chocolate'/>,
		title: 'Шоколад',
	},
	{
		img: <Image src={imgPie} alt='Chocolate'/>,
		title: 'Пироги',
	},
	{
		img: <Image src={imgDi} alt='Chocolate'/>,
		title: 'Десерты',
	},
]
