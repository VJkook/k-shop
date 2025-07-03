// src/components/sidebar.tsx
import React from 'react';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './sliderStyle.module.scss'
import Link from 'next/link'
const Sidebar: React.FC = () => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <span>Кондитерская</span>
            </div>
            <nav>
                <a href="#" className={styles.nav_link}><span>Мой аккаунт</span></a>
                <a href="/admin" className={`${styles.nav_link} ${styles.nav_link_active}`}><span>Заказы</span></a>

                <a href="/confectioners" className={styles.nav_link}><span>Кондитеры</span></a>
                <a href="/products/create" className={styles.nav_link}><span>Создать товар</span></a>

            </nav>
        </aside>
    );
};

export default Sidebar;
