import React, {useEffect, useState} from 'react';
import Sidebar  from '../element/sidebar';
import OrdersTable  from '../element/orderCard';
import  './Hero.module.scss'
import styles from './Hero.module.scss'
import {UserRole} from "../../../../models/responses/User";
import {apiGet} from "@/utils/apiInstance";
import {Order} from "../../../../models/responses/Order";


const ordersData = [
    {
        id: 1,
        customer: 'Alice Johnson',
        date: '2025-06-11',
        items: 'Chocolate cake, 12 cupcakes',
        price: 45.0,
        status: 'Received',
        statusColor: 'blue',
        phone: '+1-555-0123',
        address: '123 Main St, Downtown',
        confectioner: 'Unassigned',
    },
    {
        id: 2,
        customer: 'Bob Smith',
        date: '2025-06-11',
        items: 'Wedding cake, 50 macarons',
        price: 48.0,
        status: 'In Production',
        statusColor: 'yellow',
        phone: '+1-555-0456',
        address: '456 Business Ave',
        confectioner: 'Jean Dubois',
    },
    {
        id: 3,
        customer: 'Carol Davis',
        date: '2025-06-10',
        items: 'Birthday cake, 24 cookies',
        price: 200.0,
        status: 'Confirmed',
        statusColor: 'green',
        phone: '+1-555-0789',
        address: '789 Wedding Place',
        confectioner: 'Maria Rossi',
    },
    {
        id: 4,
        customer: 'David Wilson',
        date: '2025-06-08',
        items: 'Cheesecake, 6 muffins',
        price: 65.0,
        status: 'Cancelled',
        statusColor: 'red',
        phone: '+1-555-0321',
        address: '321 Park Lane, Apt 4',
        confectioner: 'Unassigned',
    },
];



const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    const loadOrders = () => {
        let url = '/api/orders/all'

        apiGet(url)
            .then((response) => {
                if (response.data != undefined) {
                    setOrders(response.data);
                }
            }).catch((error) => {
            console.log(error);
        });
    };

    useEffect(() => {
        loadOrders();
    }, []);

    return (
        <div className={styles.app_container}>
            <Sidebar />
            <main className={styles.main_content}>
                <h1 className={styles.page_title}>Orders Management</h1>
                <p className={styles.page_description}>View and manage all pastry shop orders</p>
                <section className={styles.orders_list}>
                    <OrdersTable orders={orders} />
                </section>
            </main>
        </div>
    );
};

export default OrdersPage;
