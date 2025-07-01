import React, { FC, useState, useMemo } from 'react';
import Link from 'next/link';
import styles from './OrderTable.module.scss';

type Order = {
    id: number;
    customer: string;
    date: string;
    items: string;
    price: number;
    status: string;
    statusColor: 'yellow' | 'blue' | 'green' | 'red';
    phone: string;
    prepTime: string;      // Новое: диапазон времени приготовления, например "10:00–12:00"
    comment?: string;      // Опциональный комментарий клиента
    confectioner: string;
};


interface OrdersTableProps {
    orders: Order[];
    onMarkDone?: (id: number) => void; // Функция, вызываемая при пометке заказа как «Готов»
}

const OrdersTable: FC<OrdersTableProps> = ({ orders, onMarkDone }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [confectionerFilter, setConfectionerFilter] = useState('All');
    const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'all'>('today');

    const statusOptions = ['All', 'Received', 'In Production', 'Confirmed', 'Cancelled'];
    const confectionerOptions = ['All', 'Unassigned', 'Jean Dubois', 'Maria Rossi'];

    const filteredOrders = useMemo(() => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);

        return orders.filter(order => {
            const matchesSearch =
                order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.phone.includes(searchTerm) ||
                order.items.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (order.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

            const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
            const matchesConfectioner = confectionerFilter === 'All' || order.confectioner === confectionerFilter;

            const orderDate = new Date(order.date);
            const matchesDate =
                dateFilter === 'all' ||
                (dateFilter === 'today' && orderDate >= startOfToday && orderDate < endOfToday) ||
                (dateFilter === 'week' && orderDate >= startOfToday && orderDate < endOfWeek);

            return matchesSearch && matchesStatus && matchesConfectioner && matchesDate;
        });
    }, [orders, searchTerm, statusFilter, confectionerFilter, dateFilter]);

    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    {dateFilter === 'today' ? 'Заказы на сегодня' :
                        dateFilter === 'week' ? 'Заказы на неделю' :
                            'Все заказы'}
                </h2>
                <span className={styles.counter}>{filteredOrders.length} заказов</span>
            </div>

            <div className={styles.dateButtons}>
                <button
                    onClick={() => setDateFilter('today')}
                    className={dateFilter === 'today' ? styles.active : ''}
                >
                    Сегодня
                </button>
                <button
                    onClick={() => setDateFilter('week')}
                    className={dateFilter === 'week' ? styles.active : ''}
                >
                    Неделя
                </button>
                <button
                    onClick={() => setDateFilter('all')}
                    className={dateFilter === 'all' ? styles.active : ''}
                >
                    Все
                </button>
            </div>

            <div className={styles.filters}>
                <div className={styles.searchContainer}>
                    <label htmlFor="search" className="sr-only">
                        Search orders
                    </label>
                    <div className={styles.searchInput}>
            <span className={styles.searchIcon}>
              <i className="fas fa-search"></i>
            </span>
                        <input
                            id="search"
                            type="search"
                            placeholder="Найти"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.filterGroup}>
                    <div className={styles.selectWrapper}>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        {statusOptions.map(o =>
                            <option key={o} value={o}>{o === 'All' ? 'Все статусы' : o}</option>
                        )}
                    </select>

                    </div>
                </div>





            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Дата</th>

                        <th>Время приготовления</th>
                        <th>Статус</th>


                        <th>Коммент.</th>
                        {onMarkDone && <th>Готово</th>}
                        <th>Детали</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredOrders.map(o => (
                        <tr key={o.id}>
                            <td>#{o.id}</td>
                            <td>
                                {new Date(o.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>

                            <td>{o.prepTime}</td>
                            <td><span className={`${styles.status} ${styles[o.statusColor]}`}>{o.status}</span></td>


                            <td>{o.comment || '-'}</td>
                            {onMarkDone && (
                                <td>
                                    {o.status === 'In Production' && (
                                        <button
                                            className={styles.doneBtn}
                                            onClick={() => onMarkDone(o.id)}
                                        >
                                            Готово
                                        </button>
                                    )}
                                </td>
                            )}
                            <td>
                                <Link href={`/confectioner-orders-details/${o.id}`}>
                                    <button className={styles.detailsLink}>Подробнее</button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                        <tr>
                            <td colSpan={onMarkDone ? 11 : 10}>Нет заказов</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default OrdersTable;
