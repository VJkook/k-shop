import React from 'react';
import Sidebar from '../element/sidebar';
import styles from './Hero.module.scss';
import EditRecipe from "@/screens/updateRecipe/element/updateRecipe";


interface params {
    id: number
}
const OrdersPage: React.FC = ({id}) => {
    return (
        <div className={styles.app_container}>
            <Sidebar />
            <main className={styles.main_content}>

                <section className={styles.orders_list}>
                    <EditRecipe id={id} />
                </section>
            </main>
        </div>
    );
};

export default OrdersPage;
