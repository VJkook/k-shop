import React, {FC, useEffect, useState} from 'react';
import Link from 'next/link';
import styles from './OrderTable.module.scss';
import {Order, OrderStatus} from "../../../../models/responses/Order";
import {apiGet} from "@/utils/apiInstance";

interface OrdersTableProps {
    orders: Order[];
}

const OrdersTable: FC<OrdersTableProps> = ({orders}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [confectionerFilter, setConfectionerFilter] = useState('All');

    const [statuses, setStatuses] = useState<OrderStatus[]>([]);


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

    useEffect(() => {
        loadStatuses()
    }, []);
    const filteredOrders = orders.filter(order => {

        const matchesSearch =
            order.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.client.phone?.includes(searchTerm) ||
            order.delivery_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.products.map(product => product.name).join(', ').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'All' || order.status.name === statusFilter;
        const matchesConfectioner = confectionerFilter === 'All' || order.confectioner?.name === confectionerFilter;

        return matchesSearch && matchesStatus && matchesConfectioner;
    });

    return (
        <section className={styles.container}>
            <div className={styles.header}>

                <span className={styles.counter}>{filteredOrders.length} заказов</span>
            </div>

            <div className={styles.filters}>
                <div className={styles.searchContainer}>
                    <label htmlFor="search" className="sr-only">
                        Поиск заказов
                    </label>
                    <div className={styles.searchInput}>
                <span className={styles.searchIcon}>
                    <i className="fas fa-search"></i>
                </span>
                        <input
                            id="search"
                            type="search"
                            placeholder="Поиск по клиенту, телефону, адресу или товару..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.filterGroup}>
                    <div className={styles.selectWrapper}>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">Все</option>
                            {statuses.map(option => (
                                <option key={option.id} value={option.name}>
                                    {option.name === 'All' ? 'Все статусы' : option.name}
                                </option>
                            ))}
                        </select>
                        <div className={styles.selectArrow}>
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                 fill="currentColor">
                                <path fillRule="evenodd"
                                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                      clipRule="evenodd"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Номер</th>
                        <th>Дата</th>
                        <th>Клиент</th>
                        <th>Адрес</th>
                        <th>Статус</th>
                        <th>Кондитер</th>
                        <th className="text-right">Сумма</th>
                        <th>Детали</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredOrders.map((order) => (
                        <tr key={order.id}>
                            <td className="font-semibold">#{order.id}</td>
                            <td>
                                {new Date(order.registration_date).toLocaleDateString('ru-RU', {
                                    month: 'short',
                                    day: 'numeric',
                                })}
                                <div className="text-xs text-gray-400">
                                    {new Date(order.registration_date).getFullYear()}
                                </div>
                            </td>
                            <td className="font-semibold">{order.client.name}</td>
                            <td className={styles.truncate} title={order.address}>
                                {order.delivery_address}
                            </td>
                            <td>
                        <span className={`${styles.status} ${styles[order.status.color]}`}>
                            {order.status.name}
                        </span>
                            </td>
                            <td>
                                {order.confectioner?.name}
                            </td>
                            <td className="text-right font-semibold">
                                {order.total_cost.toFixed(2)}
                            </td>
                            <td>
                                <Link href={`/admin-order-details/` + order.id}>
                                    <button className={styles.detailsLink}>Подробнее</button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </section>

    );
};

export default OrdersTable;
