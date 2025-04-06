import React, {FC, useState, useEffect} from 'react';
import styles from './Hero.module.scss';
import cn from 'classnames';
import Image from 'next/image';
import Logo1 from '../../../../assets/img/construct3.jpg';
import {apiGet, apiPost} from "@/utils/apiInstance";
import {ReadyCake} from "../../../../models/responses/ReadyCake";
import {Basket} from "../../../../models/responses/Basket";
import {router} from "next/client";

// @ts-ignore
const Cake: FC = (params: { id: number }) => {
    console.log(params.id)
    const [cake, setCake] = useState<ReadyCake>()
    const [basket, setBasket] = useState<Basket>()


    const addToBasket = (idProduct: number) => {
        apiPost('/api/baskets', {
            id_product: idProduct
        })
            .then((response) => {
                if (response.data != undefined) {
                    setBasket(response.data)
                }
            }).catch((error) => {
            console.log(error)
        }).finally(() => {
            router.push('/basket')
        })
    };

    const loadProduct = (idProduct: number) => {
        apiGet('/api/ready-cakes/' + idProduct)
            .then((response) => {
                console.log(response.data)
                if (response.data != undefined) {
                    setCake(response.data)
                }
            }).catch((error) => {
            console.log(error)
        })
    };

    useEffect(() => {
        if (params.id != undefined) {
            loadProduct(params.id)
        }
    }, [params.id]);

    return (
        <div className={cn(styles.base, 'wrapper')}>
            <div className={styles.main_container}>
                <div className={styles.first_box}>
                    <div className={styles.banner}>


                        <div className={styles.image_wrapper}>
                            {
                                cake?.images != undefined && cake.images.length > 0 ?
                                    (
                                        <img src={cake.images[0].url}
                                             alt={'Изображение'}
                                             className={styles.img}
                                             width={50}
                                             height={50}
                                        />
                                    ) :
                                    (
                                        <Image src={Logo1}
                                               alt={'Изображение отсутствует'}
                                               width={50}
                                               height={50}
                                               className={styles.img}/>
                                    )
                            }

                        </div>


                    </div>
                    <div className={styles.right}>

                        <div className={styles.container}>
                            <div className={styles.hprod}>
                                <h1>{cake?.name}</h1>
                            </div>
                            <div className={styles.pprice}>
                                <p className={styles.price}>{cake?.price} ₽/кг</p>
                            </div>

                            <div className={styles.pdescription}>
                                <p>
                                    {cake?.description}
                                </p>
                            </div>

                            <div className={styles.add_text}>
                                <div className={styles.add_text}>
                                    <label htmlFor="custom-text">Добавить надпись</label>
                                    <input type="text" id="custom-text" placeholder="Ваш текст"/>
                                </div>
                            </div>
                            {
                                cake != undefined ?
                                    (
                                        <button onClick={() => addToBasket(cake.id_product)}
                                                className={styles.add_to_cart}>В
                                            корзину
                                        </button>
                                    )
                                    : ''
                            }

                        </div>

                    </div>

                </div>
            </div>
        </div>
    );

};


export default Cake;
