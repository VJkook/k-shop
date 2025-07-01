import React, {FC, useEffect, useState} from 'react';
import styles from './Hero.module.scss';
import cn from 'classnames';
import Image from 'next/image';
import {apiDelete, apiGet, apiPost} from "@/utils/apiInstance";
import {OrderOrBasketItem} from "../../../../models/responses/OrderOrBasketItemsResponse";
import {router} from "next/client";
import {Address} from "../../../../models/responses/Address";

const Basket: FC = () => {
    const [baskets, setBaskets] = useState<OrderOrBasketItem[]>([]);
    const [sumPrice, setSumPrice] = useState<number>(0);
    const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [deliveryDate, setDeliveryDate] = useState<string>('');
    const [deliveryTime, setDeliveryTime] = useState<string>('17:00');

    // Функция для получения текущей даты в формате YYYY-MM-DD
    const getCurrentDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

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

    const loadAddresses = () => {
        apiGet('/api/users/addresses')
            .then((response) => {
                if (response.data) {
                    setAddresses(response.data);
                    if (response.data.length > 0) {
                        setSelectedAddressId(response.data[0].id);
                    }
                }
            })
            .catch((error) => {
                console.log('Ошибка при загрузке адресов:', error);
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
        // Устанавливаем текущую дату по умолчанию
        setDeliveryDate(getCurrentDate());
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
        if (!selectedAddressId) {
            alert('Пожалуйста, выберите адрес доставки');
            return;
        }

        if (!deliveryDate) {
            alert('Пожалуйста, выберите дату доставки');
            return;
        }

        if (!deliveryTime) {
            alert('Пожалуйста, выберите время доставки');
            return;
        }

        // Форматируем дату и время в нужный формат: YYYY-MM-DD HH:MM:00
        const deliveryDateTime = `${deliveryDate} ${deliveryTime}:00`;

        apiPost('/api/orders', {
            id_delivery_address: selectedAddressId,
            delivery_date: deliveryDateTime
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
        loadAddresses();
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
                                            style={{width: '100px', padding: '10px'}}
                                            onChange={(e) => updateBasket(item.id, Number(e.target.value))}
                                            value={item.count}
                                        >
                                            {Array.from({length: 10}, (_, index) => (
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
                            <div className={styles.address_section}>
                                <h3>Адрес доставки</h3>
                                {addresses.length > 0 ? (
                                    <select
                                        value={selectedAddressId || ''}
                                        onChange={(e) => setSelectedAddressId(Number(e.target.value))}
                                        className={styles.address_select}
                                    >
                                        {addresses.map(address => (
                                            <option key={address.id} value={address.id}>
                                                {address.address}
                                                {address.index ? ` (${address.index})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <p>У вас нет сохраненных адресов</p>
                                )}
                            </div>

                            <div className={styles.delivery_datetime}>
                                <h3>Дата и время доставки</h3>
                                <div className={styles.datetime_fields}>
                                    <div className={styles.form_group}>
                                        <label>Дата:</label>
                                        <input
                                            type="date"
                                            value={deliveryDate}
                                            onChange={(e) => setDeliveryDate(e.target.value)}
                                            min={getCurrentDate()}
                                            required
                                        />
                                    </div>
                                    <div className={styles.form_group}>
                                        <label>Время:</label>
                                        <input
                                            type="time"
                                            value={deliveryTime}
                                            onChange={(e) => setDeliveryTime(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.sum}>
                                <p className={styles.it}>Итого</p>
                                <p className={styles.price}>{sumPrice} ₽</p>
                            </div>
                            <button
                                onClick={() => createOrder()}
                                disabled={!selectedAddressId || baskets.length === 0}
                            >
                                Оформить заказ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Basket;
