import React from 'react';
import styles from '../hero/Hero.module.scss';
import Link from 'next/link'
const Sidebar: React.FC = () => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebar_logo}>
                <svg viewBox="0 0 24 24">
                    <path d="M16 3H8a4 4 0 00-4 4v10a4 4 0 004 4h8a4 4 0 004-4V7a4 4 0 00-4-4z" />
                    <path d="M12 7v6" />
                    <path d="M9 10h6" />
                </svg>
                <span>Sweet Delights</span>
            </div>
            <nav className={styles.nav}>
                <a href="#">My Account</a>
                <a href="#" className={styles.active}>Orders</a>

                <a href="#">Confectioners</a>
            </nav>
        </aside>
    );
};

export default Sidebar;
