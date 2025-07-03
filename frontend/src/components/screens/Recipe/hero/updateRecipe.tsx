import React, { useEffect, useState } from 'react';
import Sidebar from '../element/sidebar';
import styles from './Hero.module.scss';
import { UserRole } from '../../../../models/responses/User';
import { apiGet } from '@/utils/apiInstance';
import { Order } from '../../../../models/responses/Order';
import UpdateRecipe from "@/screens/Recipe/element/updateRecipe";



interface params {
    id: number
}

const OrdersPage: React.FC = ({ id }) => {


    return (
        <div className={styles.app_container}>
            <Sidebar />
                    <UpdateRecipe id={id} />

        </div>
    );
};

export default OrdersPage;
