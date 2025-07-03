import React, {useState, useEffect} from "react";
import styles from "@/screens/confectioners/hero/Hero.module.scss";
import Image from "next/image";
import cn from "classnames";
import {apiGet} from '@/utils/apiInstance';
import {Confectioner} from "../../../../models/responses/User";
import {Order} from "../../../../models/responses/Order";
import Link from "next/link";

// Функция для форматирования даты в YYYY-MM-DD
const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const ConfectionerCard = ({ confectioner }: { confectioner: Confectioner }) => {
    const [isBusy, setIsBusy] = useState(confectioner.status === "busy");
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Генерация дат на 7 дней вперед
    const generateWeekDates = () => {
        const dates = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);
            dates.push(formatDate(date));
        }

        return dates;
    };

    // Загрузка заказов при выборе даты
    useEffect(() => {
        if (!selectedDate) return;

        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await apiGet(
                    `/api/orders/for-confectioner?id_confectioner=${confectioner.id}&work_date=${selectedDate}`
                );

                if (response.data) {
                    setOrders(response.data);
                }
            } catch (err) {
                console.error('Ошибка загрузки заказов:', err);
                setError('Не удалось загрузить заказы');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [selectedDate, confectioner.id]);

    const toggleStatus = () => {
        setIsBusy(!isBusy);
    };

    const weekDates = generateWeekDates();
    const today = formatDate(new Date());

    return (
        <article aria-label={`Confectioner ${confectioner.name}`} className={styles.confectionerCard}>
            {/* Верхняя часть карточки с информацией о кондитере */}
            <header className={styles.confectionerCardHeader}>
                <div className={styles.confectionerCardHeaderAvatar}>
                    <Image
                        alt={`${confectioner.name} profile`}
                        className={styles.confectionerCardHeaderImage}
                        height={40}
                        width={40}
                        src={confectioner.image || "/default-confectioner.jpg"}
                    />
                </div>
                <div className={styles.confectionerCardHeaderInfo}>
                    <h2>{confectioner.name}</h2>
                    <p>{confectioner.specialty} Specialist</p>
                </div>
                <span className={cn(
                    styles.confectionerCardHeaderStatus,
                    !isBusy ? styles.available : styles.busy
                )}>
                    {!isBusy ? "Available" : "Busy"}
                </span>
            </header>

            <div className={styles.confectionerCardExperience}>
                <div className={styles.confectionerCardExperienceLabel}>
                    <i className="far fa-id-badge"></i>
                    Experience Level
                </div>
                <span className={styles.confectionerCardExperienceLevel}>
                    {confectioner.experience}
                </span>
            </div>
            
            {/* Недельный календарь */}
            <div className={styles.confectionerCardCalendar}>
                <h4>График на неделю</h4>
                <div className={styles.confectionerCardCalendarWeek}>
                    {weekDates.map((dateStr, index) => {
                        const date = new Date(dateStr);
                        const dayOfMonth = date.getDate();
                        const isToday = dateStr === today;

                        return (
                            <div
                                key={index}
                                className={cn(
                                    styles.confectionerCardCalendarDay,
                                    isToday && styles.today,
                                    dateStr === selectedDate && styles.selected
                                )}
                                onClick={() => setSelectedDate(dateStr === selectedDate ? null : dateStr)}
                            >
                                {dayOfMonth}
                            </div>
                        );
                    })}
                </div>

                {selectedDate && (
                    <div className={styles.confectionerCardCalendarOrders}>
                        <h5>Заказы на {new Date(selectedDate).toLocaleDateString("ru-RU", {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                        })}</h5>

                        {loading ? (
                            <p>Загрузка заказов...</p>
                        ) : error ? (
                            <p style={{ color: 'red' }}>{error}</p>
                        ) : orders.length === 0 ? (
                            <p>Нет заказов на эту дату</p>
                        ) : (
                            <ul>
                                {orders.map((order) => (
                                    <li key={order.id} className={styles.orderItem}>
                                        <div className={styles.orderHeader}>
                                            <span className={styles.orderId}>Заказ #{order.id}</span>
                                            <span className={styles.orderStatus} style={{
                                                fontWeight: 'bold'
                                            }}>
                                                {order.status.name}
                                            </span>
                                        </div>
                                        <p style={{textDecoration: 'underline'}}>
                                            <Link href={'/admin-order-details/' + order.id}>Детали заказа</Link>
                                        </p>
                                        <div className={styles.orderInfo}>
                                            <div>
                                                <strong>Сумма:</strong> {order.total_cost} руб.
                                            </div>
                                        </div>

                                        <div className={styles.orderProducts}>
                                            <strong>Продукты:</strong>
                                            <ul>
                                                {order.products.map(product => (
                                                    <li key={product.id}>
                                                        {product.name} - {product.weight} кг, {product.price} руб.
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </article>
    );
};

export default ConfectionerCard;
