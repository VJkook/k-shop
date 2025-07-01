import React, { useEffect, useState } from 'react';
import Sidebar from '../element/sidebar';
import OrdersTable from '../element/orderCard';
import styles from './Hero.module.scss';
import { UserRole } from '../../../../models/responses/User';
import { apiGet } from '@/utils/apiInstance';
import { Order } from '../../../../models/responses/Order';

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const response = await apiGet('/api/orders/for-confectioner');

            if (response.data) {
                setOrders(response.data);
            }
        } catch (err) {
            console.error('Ошибка при загрузке заказов:', err);
            setError('Не удалось загрузить заказы');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    if (loading) {
        return (
            <div className={styles.app_container}>
                <Sidebar />
                <main className={styles.main_content}>
                    <h1 className={styles.page_title}>Назначенные заказы</h1>
                    <p className={styles.page_description}>Загрузка...</p>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.app_container}>
                <Sidebar />
                <main className={styles.main_content}>
                    <h1 className={styles.page_title}>Назначенные заказы</h1>
                    <p className={styles.page_description} style={{color: 'red'}}>{error}</p>
                    <button onClick={loadOrders}>Повторить попытку</button>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.app_container}>
            <Sidebar />
            <main className={styles.main_content}>
                <h1 className={styles.page_title}>Назначенные заказы</h1>
                {orders.length === 0 ? (
                    <p className={styles.page_description}>Нет назначенных заказов</p>
                ) : (
                    <section className={styles.orders_list}>
                        <OrdersTable orders={orders} />
                    </section>
                )}
            </main>
        </div>
    );
};

export default OrdersPage;
