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



                    <OrdersTable  />


        </div>
    );
};

export default OrdersPage;
