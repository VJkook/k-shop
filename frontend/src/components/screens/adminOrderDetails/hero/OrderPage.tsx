import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import styles from './Hero.module.scss';
import Sidebar from '../elements/SideBar';
import {Confectioner, UserRole} from "../../../../models/responses/User";
import {apiGet, apiPost} from "@/utils/apiInstance";
import {Order, OrderStatus} from "../../../../models/responses/Order";

// type Confectioner = {
//     id: string;
//     name: string;
//     specialty: string;
//     level: string;
//     workload: number;
// };

type OrderItem = {
    name: string;
    quantity: number;
    price: number;
};

interface OrderDetailsProps {
    id: number
}

//
// orderId = '#2',
//     customer = 'Bob Smith',
//     date: initialDate = 'June 08, 2025 at 12:15 PM',
//     items = [
//         { name: 'Croissants', quantity: 12, price: 30.00 },
//         { name: 'Pain au Chocolat', quantity: 6, price: 18.00 }
//     ],
//     status = 'In Production',
//     assignedConfectioner,
//     confectioners = [
//         { id: '1', name: 'Maria Rossi', specialty: 'Cakes', level: 'Master', workload: 75 },
//         { id: '2', name: 'Jean Dubois', specialty: 'Pastries', level: 'Senior', workload: 45 },
//         { id: '3', name: 'Anne Dupont', specialty: 'Chocolate', level: 'Expert', workload: 90 }
//     ]
const OrderPage: React.FC<OrderDetailsProps> = ({id}) => {
    const [order, setOrder] = useState<Order>(null);
    const [confectioners, setConfectioners] = useState<Confectioner[]>([]);
    const [statuses, setStatuses] = useState<OrderStatus[]>([]);
    const [selectedStatusId, setSelectedStatusId] = useState<number>(null);

    const [selectedConfectionerId, setSelectedConfectionerId] = useState(order?.confectioner?.id || '');
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [date, setDate] = useState(order?.delivery_date);
    const [tempDate, setTempDate] = useState(order?.delivery_date);

    const loadOrder = () => {
        if (id === undefined) {
            return
        }

        let url = '/api/orders/' + id;
        apiGet(url)
            .then((response) => {
                if (response.data != undefined) {
                    setOrder(response.data);
                    setSelectedConfectionerId(response.data.confectioner?.id);
                    setSelectedStatusId(response.data.status.id);
                }
            }).catch((error) => {
            console.log(error);
        });
    };

    const loadConfectioners = () => {
        apiGet('/api/users/confectioners/available?date=' + order?.work_date)
            .then((response) => {
                if (response.data != undefined) {
                    setConfectioners(response.data);
                }
            }).catch((error) => {
            console.log(error);
        });
    };

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
        loadOrder();
        loadStatuses();
    }, [id]);

    useEffect(() => {
        if (order) {
            loadConfectioners()
        }
    }, [order]);

    const saveStatus = (e: React.FormEvent) => {
        e.preventDefault();
        apiPost('/api/orders/' + order?.id, {
            id_order_status: selectedStatusId
        }).finally(() =>
            loadOrder()
        )
        console.log('Selected confectioner:', order?.confectioner);
    };

    const handleAssign = (e: React.FormEvent) => {
        e.preventDefault();
        apiPost('/api/orders/' + order?.id, {
            id_confectioner: selectedConfectionerId
        }).finally(() =>
            loadOrder()
        )
        console.log('Selected confectioner:', order?.confectioner);
    };

    const handleDateEdit = () => {
        setIsEditingDate(true);
    };

    const handleDateSave = () => {
        setDate(tempDate);
        setIsEditingDate(false);
        apiPost('/api/orders/' + order?.id, {
            delivery_date: tempDate
        }).finally(() =>
            loadOrder()
        )
        loadOrder()
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = e.target.value.replace('T', ' ') + ':00';
        setTempDate(formatted);
    };

    return (
        <div className={styles.app}>
            <div className={styles.order_page}>
                <Sidebar/>
                <main>
                    <div className={styles.header}>
                        <Link href={'/admin'}>
                            <button>
                                <span>Назад к заказам</span>
                            </button>
                        </Link>
                        <h1>
                            <span>Заказ</span>
                            <span>{order?.id}</span>
                            <span className={styles.status}>{order?.status.name}</span>
                        </h1>
                    </div>

                    <div className={styles.grid_2x2}>
                        <section className={styles.card}>
                            <h2>
                                <span>Информация заказа</span>
                            </h2>
                            <dl>
                                <div>
                                    <dt>Клиент</dt>
                                    <dd>{order?.client.name}</dd>
                                </div>
                                <div>
                                    <dt>
                                        Дата работы
                                    </dt>
                                    <dd className={styles.date_display}>
                                        {order?.work_date}
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
                                                Edit
                                            </button>
                                        </dd>
                                    )}

                                </div>
                                <div>
                                    <dt>Total Price</dt>
                                    <dd>${order?.total_cost.toFixed(2)}</dd>
                                </div>
                                <div>
                                    <dt>Notes</dt>
                                    <dd className={styles.notes}>For office meeting tomorrow</dd>
                                </div>
                            </dl>
                        </section>

                        {/* Остальные секции остаются без изменений */}
                        <section className={styles.card}>
                            <h2>Элементы заказа</h2>
                            <ul className={styles.item_list}>
                                {order?.products.map((item, index) => (
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
                            <h2>Редактирование статуса</h2>
                            <form onSubmit={saveStatus} className={styles.form_group}>
                                <label htmlFor="order-status">Order Status</label>
                                <select
                                    id="order-status" name="order-status"
                                    value={selectedStatusId}
                                    onChange={(e) => setSelectedStatusId(e.target.value)}
                                >
                                    <option value="">-- Select --</option>
                                    {statuses?.map((status) => (
                                        <option key={status.id} value={status.id}>
                                            {status.name}
                                        </option>
                                    ))}
                                </select>
                                <button type="submit" className={`${styles.btn} ${styles.update}`}>
                                    Сохранить
                                </button>
                            </form>
                            {/*<button type="submit" className={`${styles.btn} ${styles.update}`}>Update</button>*/}
                        </section>

                        <section className={styles.card}>
                            <h2>
                                <span>Confectioner Assignment</span>
                            </h2>
                            {order?.confectioner && (
                                <div className={styles.assigned}>
                                    <p>Currently Assigned</p>
                                    {/*<p>{order?.confectioner.name} ({order?.confectioner.specialty})</p>*/}
                                    <p>{order?.confectioner.name}</p>
                                </div>
                            )}
                            <form onSubmit={handleAssign} className={styles.confectioner_form}>
                                <select
                                    id="assign-confectioner"
                                    name="assign-confectioner"
                                    value={selectedConfectionerId}
                                    onChange={(e) => setSelectedConfectionerId(e.target.value)}
                                    className={styles.confectioner_select}
                                >
                                    <option value="">-- Select --</option>
                                    {confectioners.map((conf) => (
                                        <option key={conf.id} value={conf.id}>
                                            {/*{conf.name} - {conf.specialty} ({conf.level}) - {conf.workload}% busy*/}
                                            {conf.name} - Загружен на: {conf.busy_time} ч:м:с
                                        </option>
                                    ))}
                                </select>
                                <button type="submit" className={`${styles.btn} ${styles.update}`}>
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
