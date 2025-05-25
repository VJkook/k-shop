import React, {FC, useEffect, useState} from 'react';
import styles from './Hero.module.scss';
import cn from 'classnames';
import Image from 'next/image';
import {apiDelete, apiGet, apiPost} from "@/utils/apiInstance";
import {OrderOrBasketItem} from "../../../../models/responses/OrderOrBasketItemsResponse";
import {router} from "next/client";

const Basket: FC = () => {
    const [baskets, setBaskets] = useState<OrderOrBasketItem[]>([]);
    const [sumPrice, setSumPrice] = useState<number>(0);
    const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

    const loadBasket = () => {
        apiGet('/api/basket')
            .then((response) => {
                if (response.data != undefined) {
                    setBaskets(response.data);
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
        baskets?.forEach((item: OrderOrBasketItem) => {
            if (item.price) {
                sum += item.price * item.count;
            }
        });
        setSumPrice(parseFloat(sum.toFixed(2)));
    };

    useEffect(() => {
        updateSumPrice();
    }, [baskets]);

    const updateBasket = (id: number, count: number) => {
        apiPost('/api/basket/' + id, {
            count: count
        })
            .then((response) => {
                if (response.data != undefined) {
                    loadBasket();
                }
            }).catch((error) => {
            console.log(error);
        });
    };

    const createOrder = () => {
        apiPost('/api/orders', {
            id_delivery_address: 1
        })
            .then((response) => {
                if (response.data != undefined) {
                    console.log(response.data);
                }
            }).catch((error) => {
            console.log(error);
        }).finally(() => {
            router.push('/orders');
        });
    };

    const deleteFromBasket = (id: number) => {
        apiDelete('/api/basket/' + id)
            .then((response) => {
                if (response.data != undefined) {
                    loadBasket();
                }
            }).catch((error) => {
            console.log(error);
        });
    };

    useEffect(() => {
        loadBasket();
    }, []);

    return (
        <div className={cn(styles.base, 'wrapper')}>
            <div className={styles.main_container}>
                <div className={styles.first_box}>
                    <div className={styles.banner}>
                        <div className={styles.products}>
                            {baskets?.map((item: OrderOrBasketItem) => (
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
                                                                {decor.name}: {decor.count} шт. × {decor.price} ₽
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
                                    <div className={styles.actions}>
                                        <select
                                            style={{ width: '100px', padding: '10px' }}
                                            onChange={(e) => updateBasket(item.id, Number(e.target.value))}
                                            value={item.count}
                                        >
                                            {Array.from({ length: 10 }, (_, index) => (
                                                <option key={index} value={index + 1}>{index + 1}</option>
                                            ))}
                                        </select>
                                        <button onClick={() => deleteFromBasket(item.id)}>×</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.summary}>
                            <div className={styles.sum}>
                                <p className={styles.it}>Итого</p>
                                <p className={styles.price}>{sumPrice} ₽</p>
                            </div>
                            <button onClick={() => createOrder()}>Оформить заказ</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Basket;
