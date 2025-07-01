import React, { useEffect, useState } from 'react';
import Sidebar from '../element/sidebar';
import OrdersTable from '../element/orderCard';
import styles from './Hero.module.scss';
import { UserRole } from '../../../../models/responses/User';
import { apiGet } from '@/utils/apiInstance';
import { Order } from '../../../../models/responses/Order';



const OrdersPage: React.FC = () => {


    return (
        <div className={styles.app_container}>
            <Sidebar />
            <main className={styles.main_content}>

                <section className={styles.orders_list}>
                    <OrdersTable  />
                </section>
            </main>
        </div>
    );
};

export default OrdersPage;
