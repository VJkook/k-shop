import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Hero.module.scss';
import Sidebar from '../elements/SideBar';

type OrderProduct = {
    id: number;
    name: string;
    quantity: number;
    price: number;
    workTimeMinutes: number; // добавляем время работы на этот продукт
};

type Order = {
    id: number;
    delivery_date: string;
    work_date: string;
    comment?: string; // комментарий клиента
    products: OrderProduct[];
};

interface OrderDetailsProps {
    id: number;
}

const mockOrder: Order = {
    id: 42,
    delivery_date: '2025-07-01 10:00',
    work_date: '2025-06-30',
    comment: 'Пожалуйста, без орехов и с легкой глазурью',
    products: [
        { id: 1, name: 'Торт "Наполеон"', quantity: 2, price: 1200, workTimeMinutes: 60 },
        { id: 2, name: 'Эклеры с кремом', quantity: 12, price: 600, workTimeMinutes: 30 },
        { id: 3, name: 'Маффины с черникой', quantity: 6, price: 450, workTimeMinutes: 20 },
    ]
};

const OrderPage: React.FC<OrderDetailsProps> = ({ id }) => {
    const [order, setOrder] = useState<Order | null>(null);
    const [productStatus, setProductStatus] = useState<Record<number, boolean>>({});
    const [orderCompleted, setOrderCompleted] = useState(false);

    useEffect(() => {
        // Эмуляция загрузки заказа
        setOrder(mockOrder);

        const initialStatus: Record<number, boolean> = {};
        mockOrder.products.forEach((product) => {
            initialStatus[product.id] = false;
        });
        setProductStatus(initialStatus);
    }, [id]);

    useEffect(() => {
        if (!order) return;

        const allDone = order.products.every(product => productStatus[product.id]);
        setOrderCompleted(allDone);
    }, [productStatus, order]);

    const toggleProductStatus = (productId: number) => {
        setProductStatus((prev) => ({
            ...prev,
            [productId]: !prev[productId],
        }));
    };

    const toggleOrderStatus = () => {
        if (!order) return;

        // Можно отметить заказ выполненным только если все продукты сделаны
        if (orderCompleted) {
            // Если уже выполнен, запретим снять статус (просто игнорируем)
            return;
        }

        // Устанавливаем статус заказа выполненным — все продукты должны быть помечены как сделанные
        const updatedStatus: Record<number, boolean> = {};
        order.products.forEach(p => {
            updatedStatus[p.id] = true;
        });
        setProductStatus(updatedStatus);
    };

    // Считаем общее время выполнения заказа в минутах
    const totalWorkTime = order?.products.reduce((acc, p) => acc + p.workTimeMinutes, 0) ?? 0;
    const allProductsCompleted = order?.products.every(p => productStatus[p.id]);

    return (
        <div className={styles.app}>
            <div className={styles.order_page}>
                <Sidebar />
                <main>
                    <div className={styles.header}>
                        <Link href={'/admin'}>
                            <button>
                                <span>Назад к заказам</span>
                            </button>
                        </Link>
                        <h1>
                            <span>Заказ #{order?.id}</span>
                        </h1>
                    </div>

                    <div className={styles.grid_2x2}>

                        <section className={styles.card}>
                            <h2>
                                <span>Информация заказа</span>
                            </h2>
                            <dl>

                                <div>
                                    <dt>
                                        Дата выполнения:
                                    </dt>
                                    <dd className={styles.date_display}>
                                        {order?.work_date}
                                    </dd>
                                </div>
                                <div>
                                    <dt>Время на выполнение:</dt>

                                        <dd className={styles.date_display}>
                                            {totalWorkTime} мин.
                                        </dd>

                                </div>
                                <div>
                                    <dt>Дата доставки</dt>

                                    <dd className={styles.date_display}>
                                        {order?.delivery_date}
                                    </dd>

                                </div>
                                <div>
                                    <dt>Комментарий клиента</dt>
                                    <dd className={styles.notes}>{order?.comment || '—'}</dd>
                                </div>
                            </dl>
                        </section>
                        <section className={styles.card}>
                            <h2>Состав заказа</h2>
                            <ul className={styles.item_list}>
                                {order?.products.map((item) => (
                                    <li key={item.id} className={styles.item}>
                                        <label className={styles.checkbox_item}>
                                            <input
                                                type="checkbox"
                                                checked={productStatus[item.id]}
                                                onChange={() => toggleProductStatus(item.id)}
                                            />
                                            <span className={productStatus[item.id] ? styles.completed : ''}>
                                                {item.name} — {item.quantity} шт.
                                            </span>
                                        </label>
                                        <Link href={'/Recipe'}>
                                            <button className={styles.btn_small}>Рецепт</button>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>


                        <section className={styles.card}>
                            <h2>Редактирование статуса</h2>
                            <form className={styles.form_group}>
                                <label htmlFor="order-status">Order Status</label>
                                <select>
                                    <option value="">Изготавливается</option>
                                    <option value="">Выполнен</option>
                                    {/* другие опции */}
                                </select>
                                <button
                                    type="submit"
                                    className={`${styles.btn} ${styles.update} ${!allProductsCompleted ? styles.btnDisabled : ''}`}
                                    disabled={!allProductsCompleted}
                                >
                                    Сохранить
                                </button>
                            </form>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default OrderPage;
