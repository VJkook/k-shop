import React, {FC, useState, useEffect} from 'react';
import styles from './Hero.module.scss';
import cn from 'classnames';
import Image from 'next/image';
import Logo1 from '../../../../assets/img/construct3.jpg';
import {catData} from '@/screens/catalog/hero/cat-data'
import {apiDelete, apiGet, apiPost} from "@/utils/apiInstance";
import {Order} from "../../../../models/responses/Order";
import {ReadyCake} from "../../../../models/responses/ReadyCake";
import {OrderOrBasketItem} from "../../../../models/responses/OrderOrBasketItemsResponse";
import {router} from "next/client";

const Orders: FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [sumPrice, setSumPrice] = useState<number>(0);
    const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

    const loadOrders = () => {
        apiGet('/api/orders')
            .then((response) => {
                if (response.data != undefined) {
                    setOrders(response.data);
                }
            }).catch((error) => {
            console.log(error);
        });
    };

    const toggleDetails = (id: number) => {
        setExpandedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const updateSumPrice = () => {
        let sum = 0;
        orders?.forEach((item: OrderOrBasketItem) => {
            if (item.price) {
                sum += item.price * item.count;
            }
        });
        setSumPrice(parseFloat(sum.toFixed(2)));
    };

    useEffect(() => {
        loadOrders();
    }, []);

    return (
        <div className={cn(styles.base, 'wrapper')}>
            <div className={styles.main_container}>
                <div className={styles.first_box}>
                    {orders?.map((order: Order) => (
                        <div className={styles.banner}>
                            <div className={styles.products}>
                                {order?.products?.map((item: OrderOrBasketItem) => (
                                    <div>
                                        <p>№ заказа: {order.id}</p>
                                        <p>Статус: {order.status}</p>
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
                                            {/*<div className={styles.actions}>*/}
                                            {/*    <h3>Покрытие</h3>*/}
                                            {/*    <select*/}
                                            {/*        style={{width: '100px', padding: '10px'}}*/}
                                            {/*        // onChange={(e) => updateBasket(item.id, Number(e.target.value))}*/}
                                            {/*        // value={item.count}*/}
                                            {/*    >*/}
                                            {/*        {['Вася', 'Коля', 'Петя'].map((value, index) => (*/}
                                            {/*            <option key={value} value={value}>{value}</option>*/}
                                            {/*        ))}*/}
                                            {/*    </select>*/}
                                            {/*</div>*/}

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
