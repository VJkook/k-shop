import React, {FC, useEffect, useState} from 'react';
import styles from './Hero.module.scss';
import cn from 'classnames';
import Image from 'next/image';
import {apiDelete, apiGet, apiPost} from "@/utils/apiInstance";
import {BasketResponse} from "../../../../models/responses/BasketResponse";
import {router} from "next/client";

const Basket: FC = () => {
    const [baskets, setBaskets] = useState<BasketResponse[]>()
    const [sumPrice, setSumPrice] = useState<number>(0)

    const loadBasket = () => {
        apiGet('/api/basket')
            .then((response) => {
                if (response.data != undefined) {
                    setBaskets(response.data)
                }
            }).catch((error) => {
            console.log(error)
        }).finally(() => {

        })
    };

    const updateSumPrice = () => {
        let sum = 0
        baskets?.map((item: BasketResponse) => {
            sum = sum + (item.price * item.count)
        })
        setSumPrice(parseFloat(sum.toFixed(2)))
    }

    useEffect(() => {
        updateSumPrice()
    }, [baskets]);

    const updateBasket = (id: number, count: number) => {
        apiPost('/api/basket/' + id, {
            count: count
        })
            .then((response) => {
                if (response.data != undefined) {
                    loadBasket()
                }
            }).catch((error) => {
            console.log(error)
        })
    };

    const createOrder = () => {
        apiPost('/api/orders', {
            id_delivery_address: 1
        })
            .then((response) => {
                if (response.data != undefined) {
                    console.log(response.data)
                }
            }).catch((error) => {
            console.log(error)
        }).finally(() => {
            router.push('/orders')
        })
    };

    const deleteFromBasket = (id: number) => {
        apiDelete('/api/basket/' + id)
            .then((response) => {
                if (response.data != undefined) {
                    loadBasket()
                }
            }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        loadBasket()
    }, []);

    return (
        <div className={cn(styles.base, 'wrapper')}>
            <div className={styles.main_container}>
                <div className={styles.first_box}>
                    <div className={styles.banner}>
                        <div className={styles.products}>
                            {
                                baskets?.map((item: BasketResponse) => (
                                    <div className={styles.product}>
                                        <div className={styles.image}>
                                            {
                                                item?.image != undefined ?
                                                    (
                                                        <img src={item.image}
                                                             alt={'Изображение'}
                                                             className={styles.img}
                                                             width={50}
                                                             height={50}
                                                        />
                                                    ) :
                                                    (
                                                        <Image
                                                               alt={'Изображение отсутствует'}
                                                               width={50}
                                                               height={50}
                                                               className={styles.img}/>
                                                    )
                                            }
                                        </div>
                                        <div className={styles.main_details}>
                                            <div className={styles.details}>
                                                <h2>{item.product_name}</h2>
                                                <p>{item.weight} кг</p>
                                                <p>{item.price} ₽</p>
                                                <button className={styles.toggle_details}>Детали</button>
                                            </div>
                                            <div className={styles.extra_details}>

                                            </div>
                                        </div>
                                        <div className={styles.actions}>
                                            <select onChange={
                                                (e) =>
                                                    updateBasket(item.id, Number(e.target.value))
                                            }>
                                                {
                                                    Array.from({length: 10}, (_, index) => (
                                                        item.count === index + 1 ?
                                                            <option selected value={index + 1}>{index + 1}</option> :
                                                            <option value={index + 1}>{index + 1}</option>

                                                    ))
                                                }
                                            </select>
                                            <button onClick={() => deleteFromBasket(item.id)}
                                                    className={styles.remove}>×
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }


                            {/*<div className={styles.product}>*/}
                            {/*    <div className={styles.image}>*/}
                            {/*        <Image src={Logo1} alt='Cake' className={styles.img}/>*/}
                            {/*    </div>*/}
                            {/*    <div className={styles.main_details}>*/}
                            {/*        <div className={styles.details}>*/}
                            {/*            <h2 className={styles.name}>Клубничный мир</h2>*/}
                            {/*            <p className={styles.ves}>2 кг</p>*/}
                            {/*            <p className={styles.pricep}>3000 ₽</p>*/}
                            {/*            <button className={styles.toggle_details}>Детали</button>*/}
                            {/*        </div>*/}
                            {/*        <div className={styles.extra_details}>*/}
                            {/*            <div className={styles.tier}>*/}
                            {/*                <h3>1 ярус</h3>*/}
                            {/*                <p>2 кг</p>*/}
                            {/*                <p>Медовик: 1500 ₽/кг</p>*/}
                            {/*                <p>Глазурь: 0 ₽/кг</p>*/}
                            {/*                <p>Украшения: 500 ₽</p>*/}
                            {/*            </div>*/}

                            {/*            <div className={styles.tier}>*/}
                            {/*                <h3>2 ярус</h3>*/}
                            {/*                <p>2 кг</p>*/}
                            {/*                <p>Медовик: 1500 ₽/кг</p>*/}
                            {/*                <p>Глазурь: 0 ₽/кг</p>*/}
                            {/*                <p>Украшения: 500 ₽</p>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*    <div className={styles.actions}>*/}
                            {/*        <select>*/}
                            {/*            <option value="1">1</option>*/}
                            {/*        </select>*/}
                            {/*        <button className={styles.remove}>×</button>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
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
