import React, {FC} from 'react'
import styles from './Footer.module.scss'
import Image from 'next/image'
import Logo1 from '../../../assets/img/logo1.jpg'
import cn from 'classnames'
import Link from "next/link";

const Footer: FC = () => {
    return (
        <div className={cn(styles.footer, 'wrapper')}>
            <div className={styles.logo}>
                <div className={styles.circle1}>
                    <div className={styles.circle2}>
                        <Image src={Logo1} alt='Cake' className={styles.img}/>
                    </div>
                </div>
            </div>
            <div className={styles.about}>
                <p>
                    Режим работы:
                    <br/>
                    <br/>
                    Пн - Ср 8:30 - 16:30
                    <br/> Чт - Пр 8:30 - 15:30
                    <br/> Сб 8:30 - 13:30
                    <br/> Вс выходной
                </p>
                <p>
                    Адрес магазина:
                    <br/>
                    <br/>
                    г.Киров, <br/>
                    ул. Карла Маркса д. 21
                </p>
            </div>

            <div>
                {/*<p style={{textDecoration: 'underline'}}><Link href={'/confectioner-orders'}>Заказы кондитера</Link></p>*/}
                {/*<p style={{textDecoration: 'underline'}}><Link href={'/confectioner-orders-details'}>Детали заказа кондитера</Link></p>*/}
                {/*<p style={{textDecoration: 'underline'}}><Link href={'/create-recipe'}>Создать рецепт</Link></p>*/}
                {/*<p style={{textDecoration: 'underline'}}><Link href={'/recipe'}>Рецепт</Link></p>*/}
                {/*<p style={{textDecoration: 'underline'}}><Link href={'/login'}>Login admin</Link></p>*/}
                {/*<p style={{textDecoration: 'underline'}}><Link href={'/profile'}>Profile</Link></p>*/}
            </div>
        </div>
    )
}

export default Footer
