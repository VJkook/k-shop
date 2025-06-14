// src/components/sidebar.tsx
import React from 'react';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../hero/Hero.module.scss'
import Link from 'next/link'
const Sidebar: React.FC = () => {
    return (
    <aside className={styles.sidebar}>
        <div className={styles.logo}>
            <span>Sweet Delights</span>
        </div>
        <nav>
            <a href="#" className={styles.nav_link}><span>My Account</span></a>
            <a href="/admin" className={`${styles.nav_link} ${styles.nav_link_active}`}><span>Orders</span></a>

            <a href="/konditers" className={styles.nav_link}><span>Confectioners</span></a>

            <a href="#" className={styles.nav_link}><span>Inventory</span></a>
            <a href="#" className={styles.nav_link}><span>Notifications</span></a>
            <a href="#" className={styles.nav_link}><span>Statistics</span></a>
        </nav>
    </aside>
);
};

export default Sidebar;
