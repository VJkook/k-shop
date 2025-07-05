import React, {FC, useEffect, useState} from 'react'
import styles from './Header.module.scss'
import {EIcons, Icon as IconInstance,} from '../../../assets/icons/icon'
import Image from 'next/image'
import Logo1 from '../../../assets/img/logo1.jpg'
import cn from 'classnames'
import Link from 'next/link'
import ModalLogin from '@/ui/modal/ModalSupport/ModalSupport'
import {User, UserRole} from "../../../models/responses/User";
import {apiGet} from "@/utils/apiInstance";

const Header: FC = () => {
    const [isModalOpen, setModalOpen] = useState(false)
    const [user, setUser] = useState<User>();

    const loadUser = () => {
        apiGet('/api/user')
            .then((response) => {
                if (response.data != undefined) {
                    setUser(response.data);
                }
            }).catch((error) => {
            console.log(error);
        });
    };

    useEffect(() => {
        loadUser()
    }, []);

    return (
        <noindex>
            <div className={cn(styles.menu_container, 'wrapper')}>
                <div className={styles.navmenu}>
                    <div className={styles.tabs}>
                        <button className={styles.tab}>О нас</button>
                        <button className={styles.tab}>Контакты</button>
                        <button className={styles.tab}>Режим работы</button>
                    </div>
                    <div className={styles.tabs} style={{width: '25vw'}}>
                        {user?.role === UserRole.Admin ?
                            // <Link style={{marginRight: '5px'}} href={'/products/create'}>
                            // <button className={styles.tab}>Создать товар</button>
                            // </Link>
                            <Link style={{marginRight: '5px'}} href={'/admin'}>
                                <button className={styles.tab}>Админ панель</button>
                            </Link>
                            : <div></div>
                        }

                        {user?.role === UserRole.Confectioner ?
                            // <Link style={{marginRight: '5px'}} href={'/products/create'}>
                            // <button className={styles.tab}>Создать товар</button>
                            // </Link>
                            <Link style={{marginRight: '5px'}} href={'/confectioner-orders'}>
                                <button className={styles.tab}>Панель кондитера</button>
                            </Link>
                            : <div></div>
                        }

                        <Link style={{marginRight: '5px'}} href={'/orders'}>
                            <button className={styles.tab}>Заказы</button>
                        </Link>
                        <Link href={'/basket'}>
                            <button>

                                <IconInstance name={EIcons.basket}/>

                            </button>
                        </Link>

                        <Link href={'/login'}>
                            <IconInstance name={EIcons.profile}/>
                        </Link>
                    </div>

                </div>
                <div className={styles.navmenu}>
                    <div className={styles.tabs} style={{width: '34vw'}}>
                        <Link href={'/catalog'}>
                            <button className={styles.tab}>Каталог</button>
                        </Link>
                        <Link href={'/constructor'}>
                            <button className={styles.tab}>Собрать торт</button>
                        </Link>
                    </div>
                    <div
                        className={styles.tabs}
                        style={{width: '34vw', padding: '0 5vw'}}
                    >
                        <Link href={'/stock'}>
                            <button className={styles.tab}>Акции</button>
                        </Link>
                        <button className={styles.tab}>Начинки</button>
                    </div>
                </div>


                <div className={styles.line}></div>

                <Link href={'/'}>
                    <div className={styles.logo}>
                        <div className={styles.circle1}>
                            <div className={styles.circle2}>
                                <Image src={Logo1} alt='Cake' className={styles.img}/>
                            </div>
                        </div>
                    </div>
                </Link>

            </div>
            <ModalLogin isOpen={isModalOpen} onClose={() => setModalOpen(false)}/>
        </noindex>
    )
}

export default Header
