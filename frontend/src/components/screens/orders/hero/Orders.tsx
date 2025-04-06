import React, {FC, useState, useEffect} from 'react';
import styles from './Hero.module.scss';
import cn from 'classnames';
import Image from 'next/image';
import Logo1 from '../../../../assets/img/construct3.jpg';
import {catData} from '@/screens/catalog/hero/cat-data'
import {apiGet} from "@/utils/apiInstance";
import {Order} from "../../../../models/responses/Order";
import {ReadyCake} from "../../../../models/responses/ReadyCake";

const Orders: FC = () => {
    const [orders, setOrders] = useState<Order[]>()

    useEffect(() => {
        loadOrders()
    }, []);
    const loadOrders = () => {
        apiGet('/api/orders')
            .then((response) => {
                if (response.data.length) {
                    setOrders(response.data)
                }
            }).catch((error) => {
            console.log(error)
        })
    }
    return (
        <div className={styles.ordersContainer}>
            {orders?.map((order: Order) => (
                <div key={order.id} className={styles.order}>
                    <h2 className={styles.orderNumber}>Номер заказа: {order.id}</h2>
                    <div className={styles.banner}>
                        <p className={styles.ves}>Статус: {order.status}</p>
                        <p className={styles.ves}>Статус оплаты: {order.payment_status}</p>
                        {order.ready_cakes.map((readyCake: ReadyCake, index) => (
                            <div key={index} className={styles.product}>
                                <div className={styles.image}>
                                    <img
                                        src={readyCake.images && readyCake.images.length > 0 ? readyCake.images[0].url : 'Изображение отсутствует'}
                                    />
                                </div>
                                <div className={styles.main_details}>
                                    <div className={styles.details}>
                                        <h2 className={styles.name}>{readyCake.name}</h2>
                                        <p className={styles.ves}>{readyCake.weight} кг</p>
                                        <p className={styles.pricep}>{readyCake.price}</p>
                                        <button className={styles.toggle_details}>Детали</button>
                                    </div>
                                    {/*{readyCake.details && (*/}
                                    {/*  <div className={`${styles.extra_details} ${styles.visible}`}>*/}
                                    {/*    {readyCake.details.map((detail, idx) => (*/}
                                    {/*      <div key={idx} className={styles.tier}>*/}
                                    {/*        <h3>{detail.tier}</h3>*/}
                                    {/*        <p>{detail.weight}</p>*/}
                                    {/*        <p>{detail.pricePerKg}</p>*/}
                                    {/*        <p>{detail.glazePrice}</p>*/}
                                    {/*        <p>{detail.decorationPrice}</p>*/}
                                    {/*      </div>*/}
                                    {/*    ))}*/}
                                    {/*  </div>*/}
                                    {/*)}*/}
                                </div>
                                <div className={styles.actions}>
                                    <button className={styles.remove}>Повторить заказ</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};


export default Orders;
