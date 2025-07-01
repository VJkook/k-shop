import React, { useEffect, useState } from 'react';
import Sidebar from '../element/sidebar';
import OrdersTable from '../element/orderCard';
import styles from './Hero.module.scss';
import { UserRole } from '../../../../models/responses/User';
import { apiGet } from '@/utils/apiInstance';
import { Order } from '../../../../models/responses/Order';


const exampleOrders = [
    {
        id: 1,
        customer: 'Иван Иванов',
        date: new Date().toISOString(),
        items: 'Торт "Наполеон"',
        price: 1200,
        status: 'In Production',
        statusColor: 'blue',
        phone: '+79001234567',
        prepTime: '10:00–12:00',
        comment: 'Позвонить перед доставкой',
        confectioner: 'Jean Dubois',
    },
    {
        id: 2,
        customer: 'Мария Смирнова',
        date: new Date().toISOString(),
        items: 'Пирожные "Эклеры"',
        price: 800,
        status: 'Received',
        statusColor: 'yellow',
        phone: '+79007654321',
        prepTime: '14:00–16:00',
        confectioner: 'Maria Rossi',
    },
    {
        id: 3,
        customer: 'Алексей Петров',
        date: new Date().toISOString(),
        items: 'Чизкейк "Нью-Йорк"',
        price: 950,
        status: 'Confirmed',
        statusColor: 'green',
        phone: '+79005556677',
        prepTime: '12:00–14:00',
        confectioner: 'Unassigned',
    }
];


const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        setOrders(exampleOrders); // или apiGet...
    }, []);

    return (
        <div className={styles.app_container}>
            <Sidebar />
            <main className={styles.main_content}>
                <h1 className={styles.page_title}>Назначенные заказы</h1>
                <p className={styles.page_description}></p>
                <section className={styles.orders_list}>
                    <OrdersTable orders={orders} />
                </section>
            </main>
        </div>
    );
};

export default OrdersPage;
