// src/components/sidebar.tsx
import React from 'react';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './sliderStyle.module.scss'
import Link from 'next/link'
const Sidebar: React.FC = () => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <span>Кондитерская </span>
            </div>
            <nav>
                <a href="#" className={styles.nav_link}><span>Мой профиль</span></a>
                <a href="/confectioner-orders" className={styles.nav_link}><span>Заказы</span></a>

                <a href="/create-recipe" className={`${styles.nav_link} ${styles.nav_link_active}`}><span>Новый рецепт</span></a>



            </nav>
        </aside>
    );
};

export default Sidebar;
