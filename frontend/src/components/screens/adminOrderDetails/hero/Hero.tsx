import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Hero.module.scss';
import Sidebar from '../elements/SideBar';

type Confectioner = {
    id: string;
    name: string;
    specialty: string;
    level: string;
    workload: number;
};

type OrderItem = {
    name: string;
    quantity: number;
    price: number;
};

interface OrderDetailsProps {
    orderId: string;
    customer: string;
    date: string;
    items: OrderItem[];
    status: string;
    assignedConfectioner?: Confectioner;
    confectioners: Confectioner[];
}

const OrdersPage: React.FC<OrderDetailsProps> = ({
                                                     orderId = '#2',
                                                     customer = 'Bob Smith',
                                                     date: initialDate = 'June 08, 2025 at 12:15 PM',
                                                     items = [
                                                         { name: 'Croissants', quantity: 12, price: 30.00 },
                                                         { name: 'Pain au Chocolat', quantity: 6, price: 18.00 }
                                                     ],
                                                     status = 'In Production',
                                                     assignedConfectioner,
                                                     confectioners = [
                                                         { id: '1', name: 'Maria Rossi', specialty: 'Cakes', level: 'Master', workload: 75 },
                                                         { id: '2', name: 'Jean Dubois', specialty: 'Pastries', level: 'Senior', workload: 45 },
                                                         { id: '3', name: 'Anne Dupont', specialty: 'Chocolate', level: 'Expert', workload: 90 }
                                                     ]
                                                 }) => {
    const [selectedConfectioner, setSelectedConfectioner] = useState(assignedConfectioner?.id || '');
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [date, setDate] = useState(initialDate);
    const [tempDate, setTempDate] = useState(initialDate);

    const handleAssign = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Selected confectioner:', selectedConfectioner);
    };

    const handleDateEdit = () => {
        setIsEditingDate(true);
    };

    const handleDateSave = () => {
        setDate(tempDate);
        setIsEditingDate(false);
        // Здесь можно добавить вызов API для сохранения даты
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempDate(e.target.value);
    };

    return (
        <div className={styles.app}>
            <div className={styles.order_page}>
                <Sidebar />
                <main>
                    <div className={styles.header}>
                        <Link href={'/admin'}>
                            <button>
                                <span>Back to Orders</span>
                            </button>
                        </Link>
                        <h1>
                            <span>Order</span>
                            <span>{orderId}</span>
                            <span className={styles.status}>{status}</span>
                        </h1>
                    </div>

                    <div className={styles.grid_2x2}>
                        <section className={styles.card}>
                            <h2>
                                <span>Order Information</span>
                            </h2>
                            <dl>
                                <div>
                                    <dt>Customer</dt>
                                    <dd>{customer}</dd>
                                </div>
                                <div>
                                    <dt>Order Date</dt>
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
                                                Save
                                            </button>
                                        </div>
                                    ) : (
                                        <dd className={styles.date_display}>
                                            {date}
                                            <button
                                                onClick={handleDateEdit}
                                                className={styles.date_edit_button}
                                            >
                                                Edit
                                            </button>
                                        </dd>
                                    )}
                                </div>
                                <div>
                                    <dt>Total Price</dt>
                                    <dd>${items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</dd>
                                </div>
                                <div>
                                    <dt>Notes</dt>
                                    <dd className={styles.notes}>For office meeting tomorrow</dd>
                                </div>
                            </dl>
                        </section>

                        {/* Остальные секции остаются без изменений */}
                        <section className={styles.card}>
                            <h2>Order Items</h2>
                            <ul className={styles.item_list}>
                                {items.map((item, index) => (
                                    <li key={index} className={styles.item}>
                                        <div>
                                            <h3>{item.name}</h3>
                                            <p>Quantity: {item.quantity}</p>
                                        </div>
                                        <span>${item.price.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className={styles.card}>
                            <h2>Status Management</h2>
                            <form className={styles.form_group}>
                                <label htmlFor="order-status">Order Status</label>
                                <select id="order-status" name="order-status">
                                    <option>Completed</option>
                                    <option>In progress</option>
                                </select>
                            </form>
                            <button type="submit" className={`${styles.btn} ${styles.update}`}>Update</button>
                        </section>

                        <section className={styles.card}>
                            <h2>
                                <span>Confectioner Assignment</span>
                            </h2>
                            {assignedConfectioner && (
                                <div className={styles.assigned}>
                                    <p>Currently Assigned</p>
                                    <p>{assignedConfectioner.name} ({assignedConfectioner.specialty})</p>
                                </div>
                            )}
                            <form onSubmit={handleAssign} className={styles.confectioner_form}>
                                <select
                                    id="assign-confectioner"
                                    name="assign-confectioner"
                                    value={selectedConfectioner}
                                    onChange={(e) => setSelectedConfectioner(e.target.value)}
                                    className={styles.confectioner_select}
                                >
                                    <option value="">-- Select --</option>
                                    {confectioners.map((conf) => (
                                        <option key={conf.id} value={conf.id}>
                                            {conf.name} - {conf.specialty} ({conf.level}) - {conf.workload}% busy
                                        </option>
                                    ))}
                                </select>
                                <button type="submit" className={`${styles.btn} ${styles.update}`}>
                                    Assign
                                </button>
                            </form>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default OrdersPage;
