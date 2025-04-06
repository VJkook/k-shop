import React, { FC, useState, useEffect  } from 'react';
import styles from './Hero.module.scss';
import cn from 'classnames';
import Image from 'next/image';
import Logo1 from '../../../../assets/img/construct3.jpg';
import { catData } from '@/screens/catalog/hero/cat-data'
interface CatData {
  img: React.ReactNode | null
  title: string
  price: number
  weight: number
  category: number
}

const orders = [
    {
      id: '12345',
      products: [
        {
          name: 'Клубничный мир',
          weight: '2 кг',
          price: '3000 ₽',
          img: <Image src={Logo1} alt='Cake'/>,
        },
        // Добавьте больше продуктов, если нужно
      ],
    },
    {
      id: '67890',
      products: [
        {
          name: 'Клубничный мир',
          weight: '2 кг',
          price: '3000 ₽',
          img: <Image src={Logo1} alt='Cake'/>,
        },
        {
          name: 'Клубничный мир',
          weight: '2 кг',
          price: '3000 ₽',
          img: <Image src={Logo1} alt='Cake'/>,
          details: [
            {
              tier: '1 ярус',
              weight: '2 кг',
              pricePerKg: 'Медовик: 1500 ₽/кг',
              glazePrice: 'Глазурь: 0 ₽/кг',
              decorationPrice: 'Украшения: 500 ₽',
            },
            {
              tier: '2 ярус',
              weight: '2 кг',
              pricePerKg: 'Медовик: 1500 ₽/кг',
              glazePrice: 'Глазурь: 0 ₽/кг',
              decorationPrice: 'Украшения: 500 ₽',
            },
          ],
        },
      ],
    },
  ];
const OrderCreate: FC = () => {


  return (
    <div className={styles.ordersContainer}>
    {orders.map((order) => (
      <div key={order.id} className={styles.order}>
        <h2 className={styles.orderNumber}>Номер заказа: {order.id}</h2>
        <div className={styles.banner}>
          {order.products.map((product, index) => (
            <div key={index} className={styles.product}>
              <div className={styles.image}>
               {product.img}
              </div>
              <div className={styles.main_details}>
                <div className={styles.details}>
                  <h2 className={styles.name}>{product.name}</h2>
                  <p className={styles.ves}>{product.weight}</p>
                  <p className={styles.pricep}>{product.price}</p>
                  <button className={styles.toggle_details}>Детали</button>
                </div>
                {product.details && (
                  <div className={`${styles.extra_details} ${styles.visible}`}>
                    {product.details.map((detail, idx) => (
                      <div key={idx} className={styles.tier}>
                        <h3>{detail.tier}</h3>
                        <p>{detail.weight}</p>
                        <p>{detail.pricePerKg}</p>
                        <p>{detail.glazePrice}</p>
                        <p>{detail.decorationPrice}</p>
                      </div>
                    ))}
                  </div>
                )}
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

export default OrderCreate;
