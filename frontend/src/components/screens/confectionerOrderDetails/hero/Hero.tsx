import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Hero.module.scss';
import Sidebar from '../elements/SideBar';
import { apiGet, apiPost } from '@/utils/apiInstance';
import { Order, OrderStatus } from "../../../../models/responses/Order";

interface OrderDetailsProps {
    id: number;
}

const OrderPage: React.FC<OrderDetailsProps> = ({ id }) => {
    const [order, setOrder] = useState<Order | null>(null);
    const [productStatus, setProductStatus] = useState<Record<number, boolean>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Состояния для работы со статусами
    const [statuses, setStatuses] = useState<OrderStatus[]>([]);
    const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);

    // Состояния для редактирования даты доставки
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [tempDate, setTempDate] = useState<string>('');

    const loadOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await apiGet(`/api/orders/${id}`);

            if (response.data) {
                const orderData = response.data;
                setOrder(orderData);
                setSelectedStatusId(orderData.status.id);

                // Инициализируем статусы продуктов
                const initialStatus: Record<number, boolean> = {};

                // Автоматически отмечаем все товары для статусов "В доставке" и "Доставлен"
                const shouldMarkAllCompleted =
                    orderData.status.name === "В доставке" ||
                    orderData.status.name === "Доставлен";

                orderData.products.forEach((product: any) => {
                    initialStatus[product.id] = shouldMarkAllCompleted;
                });

                setProductStatus(initialStatus);
            }
        } catch (err) {
            console.error('Ошибка при загрузке заказа:', err);
            setError('Не удалось загрузить данные заказа');
        } finally {
            setLoading(false);
        }
    };

    // Функция загрузки статусов
    const loadStatuses = () => {
        apiGet('/api/orders/statuses')
            .then((response) => {
                if (response.data != undefined) {
                    setStatuses(response.data);
                }
            }).catch((error) => {
            console.log(error);
        });
    };

    // Функция сохранения статуса
    const saveStatus = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStatusId) return;

        apiPost('/api/orders/' + id, {
            id_order_status: selectedStatusId
        }).finally(() => {
            loadOrderDetails();
        });
    };

    // Функции для редактирования даты доставки
    const handleDateEdit = () => {
        setIsEditingDate(true);
        setTempDate(order?.delivery_date || '');
    };

    const handleDateSave = () => {
        setIsEditingDate(false);

        apiPost('/api/orders/' + id, {
            delivery_date: tempDate
        }).finally(() => {
            loadOrderDetails();
        });
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempDate(e.target.value);
    };

    // Проверяем, все ли продукты выполнены
    const allProductsCompleted = order?.products.every(p => productStatus[p.id]);

    useEffect(() => {
        if (id) {
            loadOrderDetails();
            loadStatuses();
        }
    }, [id]);

    const toggleProductStatus = (productId: number) => {
        // Если статус "В доставке" или "Доставлен", блокируем изменения
        if (order?.status.name === "В доставке" || order?.status.name === "Доставлен") {
            return;
        }

        setProductStatus((prev) => ({
            ...prev,
            [productId]: !prev[productId],
        }));
    };

    if (loading) {
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
                            <h1><span>Загрузка заказа #{id}...</span></h1>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (error) {
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
                            <h1><span>Ошибка загрузки заказа</span></h1>
                        </div>
                        <p style={{ color: 'red', padding: '20px' }}>{error}</p>
                        <button onClick={loadOrderDetails} className={styles.btn}>
                            Повторить попытку
                        </button>
                    </main>
                </div>
            </div>
        );
    }

    // Проверяем, заблокированы ли чекбоксы
    const isCheckboxDisabled =
        order?.status.name === "В доставке" ||
        order?.status.name === "Доставлен";

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
                                    <dd>
                                        {order?.work_time}
                                    </dd>
                                </div>
                                <div>
                                    <dt>Дата доставки</dt>
                                    {isEditingDate ? (
                                        <div className={styles.date_edit_wrapper}>
                                            <input
                                                type="datetime-local"
                                                value={tempDate}
                                                onChange={handleDateChange}
                                                className={styles.date_input}
                                            />
                                            <button
                                                onClick={handleDateSave}
                                                className={styles.date_save}
                                            >
                                                Сохранить
                                            </button>
                                        </div>
                                    ) : (
                                        <dd className={styles.date_display}>
                                            {order?.delivery_date}
                                            <button
                                                onClick={handleDateEdit}
                                                className={styles.date_edit_button}
                                            >
                                                Изменить
                                            </button>
                                        </dd>
                                    )}
                                </div>
                                <div>
                                    <dt>Комментарий клиента</dt>
                                    <dd className={styles.notes}>{order?.comment || '—'}</dd>
                                </div>
                                <div>
                                    <dt>Статус заказа</dt>
                                    <dd className={styles.notes}>
                                        <span style={{
                                            fontWeight: 'bold'
                                        }}>
                                            {order?.status.name}
                                        </span>
                                    </dd>
                                </div>
                            </dl>
                        </section>
                        <section className={styles.card}>
                            <h2>Состав заказа</h2>
                            <span style={{
                                fontWeight: 'bold',
                                color: allProductsCompleted ? 'green' : 'orange',
                                display: 'block',
                                marginBottom: '10px'
                            }}>
                                {allProductsCompleted ? 'Все продукты выполнены' : 'Не все продукты выполнены'}
                                {isCheckboxDisabled && " (автоматически отмечены)"}
                            </span>
                            <ul className={styles.item_list}>
                                {order?.products.map((item) => (
                                    <li key={item.id} className={styles.item}>
                                        <label className={styles.checkbox_item}>
                                            <input
                                                type="checkbox"
                                                checked={productStatus[item.id]}
                                                onChange={() => toggleProductStatus(item.id)}
                                                disabled={isCheckboxDisabled}
                                            />
                                            <span className={productStatus[item.id] ? styles.completed : ''}>
                                                {item.name} — {item.quantity} шт.
                                            </span>
                                        </label>
                                        <Link href={'/recipe'}>
                                            <button className={styles.btn_small}>Рецепт</button>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className={styles.card}>
                            <h2>Редактирование статуса</h2>
                            <form onSubmit={saveStatus} className={styles.form_group}>
                                <label htmlFor="order-status">Статус заказа</label>
                                <select
                                    value={selectedStatusId || ''}
                                    onChange={(e) => setSelectedStatusId(Number(e.target.value))}
                                >
                                    <option value="">-- Выберите --</option>
                                    {statuses.map((status) => (
                                        <option key={status.id} value={status.id}>
                                            {status.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="submit"
                                    className={`${styles.btn} ${styles.update} ${!allProductsCompleted ? styles.btnDisabled : ''}`}
                                    disabled={!allProductsCompleted}
                                >
                                    Сохранить статус
                                </button>
                                {!allProductsCompleted && (
                                    <div style={{ color: 'red', marginTop: '10px' }}>
                                        Для сохранения статуса все продукты должны быть выполнены
                                    </div>
                                )}
                            </form>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default OrderPage;
