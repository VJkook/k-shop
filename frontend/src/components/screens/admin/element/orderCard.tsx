import React, { FC, useState } from 'react';
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
    address: string;
    confectioner: string;
};

interface OrdersTableProps {
    orders: Order[];
}

const OrdersTable: FC<OrdersTableProps> = ({ orders }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [confectionerFilter, setConfectionerFilter] = useState('All');

    const statusOptions = ['All', 'Received', 'In Production', 'Confirmed', 'Cancelled'];
    const confectionerOptions = ['All', 'Unassigned', 'Jean Dubois', 'Maria Rossi'];

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.phone.includes(searchTerm) ||
            order.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.items.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
        const matchesConfectioner = confectionerFilter === 'All' || order.confectioner === confectionerFilter;

        return matchesSearch && matchesStatus && matchesConfectioner;
    });

    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Orders Management</h2>
                <span className={styles.counter}>{filteredOrders.length} orders</span>
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
                            placeholder="Search by customer, phone, address, or product..."
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
                            {statusOptions.map(option => (
                                <option key={option} value={option}>
                                    {option === 'All' ? 'All Statuses' : option}
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

                    <div className={styles.selectWrapper}>
                        <select
                            value={confectionerFilter}
                            onChange={(e) => setConfectionerFilter(e.target.value)}
                        >
                            {confectionerOptions.map(option => (
                                <option key={option} value={option}>
                                    {option === 'All' ? 'All Confectioners' : option}
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
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Client</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Status</th>
                        <th>Confectioner</th>
                        <th className="text-right">Price</th>
                        <th>Details</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredOrders.map((order) => (
                        <tr key={order.id}>
                            <td className="font-semibold">#{order.id}</td>
                            <td>
                                {new Date(order.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                })}
                                <div className="text-xs text-gray-400">
                                    {new Date(order.date).getFullYear()}
                                </div>
                            </td>
                            <td className="font-semibold">{order.customer}</td>
                            <td>{order.phone}</td>
                            <td className={styles.truncate} title={order.address}>
                                {order.address}
                            </td>
                            <td>
                <span className={`${styles.status} ${styles[order.statusColor]}`}>
                  {order.status}
                </span>
                            </td>
                            <td>
                                {order.confectioner}
                            </td>
                            <td className="text-right font-semibold">
                                ${order.price.toFixed(2)}
                            </td>
                            <td>
                                <Link href={`/adminOrderDetails/`}>
                                    <button className={styles.detailsLink}>View Details</button>
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
