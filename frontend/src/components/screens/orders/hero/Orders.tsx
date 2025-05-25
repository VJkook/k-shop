import React, {FC, useEffect, useState} from 'react';
import styles from './Hero.module.scss';
import cn from 'classnames';
import Image from 'next/image';
import {apiGet, apiPost} from "@/utils/apiInstance";
import {Order} from "../../../../models/responses/Order";
import {OrderOrBasketItem} from "../../../../models/responses/OrderOrBasketItemsResponse";
import {User, UserRole} from "../../../../models/responses/User";

const Orders: FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
    const [user, setUser] = useState<User>();
    const [confectioners, setConfectioners] = useState<User[]>([]);

    const loadOrders = () => {
        let url = '/api/orders';
        if (user?.role === UserRole.Admin) {
            url = '/api/orders/all'
        }

        apiGet(url)
            .then((response) => {
                if (response.data != undefined) {
                    setOrders(response.data);
                }
            }).catch((error) => {
            console.log(error);
        });
    };

    const loadUser = () => {
        apiGet('/api/user')
            .then((response) => {
                if (response.data != undefined) {
                    setUser(response.data);
                }
            }).catch((error) => {
            console.log(error);
        });
    };

    const loadConfectioners = () => {
        apiGet('/api/users/confectioners')
            .then((response) => {
                if (response.data != undefined) {
                    setConfectioners(response.data);
                }
            }).catch((error) => {
            console.log(error);
        });
    };

    const selectConfectioner = (confectionerId: number, orderId: number) => {
        apiPost('/api/orders/' + orderId, {
            id_confectioner: confectionerId
        }).finally(() =>
            loadOrders()
        )
    };

    const toggleDetails = (id: number) => {
        setExpandedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    useEffect(() => {
        loadUser();
        loadOrders();
        loadConfectioners()
    }, []);

    useEffect(() => {
        loadOrders();
    }, [user]);


    return (
        <div className={cn(styles.base, 'wrapper')}>
            <div className={styles.main_container}>
                <div className={styles.first_box}>
                    {orders?.map((order: Order) => (
                        <div key={order.id} className={styles.banner}>
                            <div className={styles.order_header}>
                                <p>№ заказа: {order.id}</p>
                                <p>Статус: {order.status}</p>
                                <p>Общая сумма заказа: {order.total_cost} ₽</p>
                                {user?.role === UserRole.Admin && (
                                    <div>
                                        <h3>Выбрать кондитера: </h3>
                                        <br/>
                                        <select
                                            value={order.id_confectioner || ''}
                                            onChange={(e) => selectConfectioner(Number(e.target.value), order.id)}
                                        >
                                            <option value="" disabled>Выберите кондитера</option>
                                            {confectioners.map((c: User) => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>)
                                }
                            </div>
                            <div className={styles.products}>
                                {order?.products?.map((item: OrderOrBasketItem) => (
                                    <div>
                                        <div key={item.id} className={styles.product}>
                                            <div className={styles.image}>
                                                {item?.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={'Изображение'}
                                                        className={styles.img}
                                                        width={50}
                                                        height={50}
                                                    />
                                                ) : (
                                                    <Image
                                                        alt={'Изображение отсутствует'}
                                                        width={50}
                                                        height={50}
                                                        className={styles.img}
                                                    />
                                                )}
                                            </div>
                                            <div className={styles.main_details}>
                                                <div className={styles.details}>
                                                    <h2>{item.name}</h2>
                                                    <p>{item.weight} кг</p>
                                                    <p>{item.price} ₽</p>
                                                    <p>Кол-во: {item.count}</p>
                                                    {item.details && (
                                                        <button
                                                            className={styles.toggle_details}
                                                            onClick={() => toggleDetails(item.id)}
                                                        >
                                                            {expandedItems[item.id] ? 'Скрыть детали' : 'Показать детали'}
                                                        </button>
                                                    )}
                                                </div>
                                                {expandedItems[item.id] && item.details && (
                                                    <div
                                                        className={cn(styles.extra_details, {[styles.visible]: expandedItems[item.id]})}>
                                                        {item.details.tiers?.map((tier, index) => (
                                                            <div key={index} className={styles.tier}>
                                                                <h3>{index + 1} ярус</h3>
                                                                <p>{tier.weight} кг</p>
                                                                <p>{tier.filling.name}: {tier.filling.price_by_kg} ₽/кг</p>
                                                                <p>Итого: {(tier.filling.price_by_kg * tier.weight).toFixed(2)} ₽</p>
                                                            </div>
                                                        ))}
                                                        {item.details.decors?.length > 0 && (
                                                            <div className={styles.tier}>
                                                                <h3>Украшения</h3>
                                                                {item.details.decors.map((decor, idx) => (
                                                                    <p key={idx}>
                                                                        {decor.name}: {decor.count} шт.
                                                                        × {decor.price} ₽
                                                                        = {decor.price * decor.count} ₽
                                                                    </p>
                                                                ))}
                                                            </div>
                                                        )}
                                                        {item.details?.coverage && (
                                                            <div className={styles.tier}>
                                                                <h3>Покрытие</h3>
                                                                <p>
                                                                    {item.details?.coverage.name}:
                                                                    шт. {item.details?.coverage.price} ₽
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};


export default Orders;
