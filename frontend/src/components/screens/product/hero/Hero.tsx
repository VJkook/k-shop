import React, { FC, useState, useEffect  } from 'react';
import styles from './Hero.module.scss';
import cn from 'classnames';
import Image from 'next/image';
import Logo1 from '../../../../assets/img/construct3.jpg';
import { catData } from '@/screens/product/hero/cat-data'
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
		 


    <div className={styles.image_wrapper}>
          <Image src={Logo1} alt='Cake' className={styles.img}/>
              </div>
       



		</div>
		<div className={styles.right}>

    <div className={styles.container}>
      <div className={styles.hprod}>
        <h1 >Клубничный мир</h1>
        </div>
        <div className={styles.pprice}>
          <p className={styles.price}>1500 ₽/кг</p>
        </div>
        
        <div className={styles.pdescription}>
          <p >
              Описание тортика.
              Тортик супер милый и подойдёт на любой праздник!
              Так же подарит улыбку в любой день
          </p>
        </div>
        
        <div className={styles.add_text}>
        <div className={styles.add_text}>
            <label htmlFor="custom-text">Добавить надпись</label>
            <input type="text" id="custom-text" placeholder="Ваш текст" />
      </div>
        </div>
        <button className={styles.add_to_cart}>В корзину</button>
    </div>

		</div>

		
        </div>
      </div>
    </div>
  );

  
};





export default Hero;