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


const Hero: FC = () => {
  

  return (
	<div className={cn(styles.base, 'wrapper')}>
	<div className={styles.main_container}>
	  <div className={styles.first_box}>
		<div className={styles.banner}>
		 



    <div className={styles.products}>
                    <div className={styles.product}>
                        <div className={styles.image}>
                        <Image src={Logo1} alt='Cake' className={styles.img}/>
                        </div>
                        <div className={styles.main_details}>
                            <div className={styles.details}>
                                <h2>Клубничный мир</h2>
                                <p>2 кг</p>
                                <p>3000 ₽</p>
                                <button className={styles.toggle_details}>Детали</button>
                            </div>
                            <div className={styles.extra_details}>
                               
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <select>
                                <option value="1">1</option>
                            </select>
                            <button className={styles.remove}>×</button>
                        </div>
                    </div>
                   
                    <div className={styles.product}>
                        <div className={styles.image}>
                        <Image src={Logo1} alt='Cake' className={styles.img}/>
                        </div>
                        <div className={styles.main_details}>
                            <div className={styles.details}>
                                <h2 className={styles.name}>Клубничный мир</h2>
                                <p className={styles.ves}>2 кг</p>
                                <p className={styles.pricep}>3000 ₽</p>
                                <button className={styles.toggle_details}>Детали</button>
                            </div>
                            <div className={styles.extra_details}>
                                <div className={styles.tier}>
                                    <h3>1 ярус</h3>
                                    <p>2 кг</p>
                                    <p>Медовик: 1500 ₽/кг</p>
                                    <p>Глазурь: 0 ₽/кг</p>
                                    <p>Украшения: 500 ₽</p>
                                </div>
                              
                                <div className={styles.tier}>
                                    <h3>2 ярус</h3>
                                    <p>2 кг</p>
                                    <p>Медовик: 1500 ₽/кг</p>
                                    <p>Глазурь: 0 ₽/кг</p>
                                    <p>Украшения: 500 ₽</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <select>
                                <option value="1">1</option>
                            </select>
                            <button className={styles.remove}>×</button>
                        </div>
                    </div>
                </div>

		
       



		</div>
		<div className={styles.right}>

		<div className={styles.summary}>
      
    <div className={styles.sum}>
                    <p className={styles.it}>Итого</p>
                    <p className={styles.price}>3000 ₽</p>
    </div>


                   


                    <button>Оформить заказ</button>
                </div>

		</div>

		
        </div>
      </div>
    </div>
  );

  
};





export default Hero;