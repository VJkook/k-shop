import React, { FC, useState, useEffect  } from 'react';
import styles from './Hero.module.scss';
import cn from 'classnames';
import Image from 'next/image';

import Link from 'next/link'
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
  

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const handleCategoryChange = (categories: number[]) => {
    console.log('Selected categories:', categories); // Лог выбранных категорий
    setSelectedCategories(categories);
  };

  useEffect(() => {
    console.log('Current selected categories:', selectedCategories); // Лог текущих выбранных категорий
  }, [selectedCategories]);

  const handleSubcategoryChange = (category: number) => (event: React.MouseEvent<HTMLLIElement>) => {
    event.stopPropagation(); // Предотвращение распространения события на родительские элементы
    handleCategoryChange([category]);
  };

  const handleAllTortas = () => {
    handleCategoryChange([1, 2, 3, 4]); // Показать все торты
  };

  const handleAllPirog = () => {
    handleCategoryChange([5,6,7]); // Показать все пирожные
  };



  return (
	<div className={cn(styles.base, 'wrapper')}>
	<div className={styles.main_container}>
	  <div className={styles.first_box}>
		<div className={styles.banner}>
		 


		

<ul className={styles.category_list}>
              <li className={styles.category} onClick={() => handleCategoryChange([])}><a href="#">Все</a></li>
              <li className={styles.category}>
              <button onClick={handleAllTortas}>Торты</button>
                <ul className={styles.subcategory_list}>
                  <li onClick={() => handleCategoryChange([1])}><a href="#">Бенто торты</a></li>
                  <li onClick={() => handleCategoryChange([2])}><a href="#">На день рождение</a></li>
                  <li onClick={() => handleCategoryChange([3])}><a href="#">Детский торт</a></li>
                  <li onClick={() => handleCategoryChange([4])}><a href="#">Свадебные торты</a></li>
                </ul>
              </li>
              <li className={styles.category}>
              <button onClick={handleAllPirog}>Пирожные</button>
                <ul className={styles.subcategory_list}>
                  <li onClick={() => handleCategoryChange([5])}><a href="#">Эклеры</a></li>
                  <li onClick={() => handleCategoryChange([6])}><a href="#">Макароны</a></li>
                  <li onClick={() => handleCategoryChange([7])}><a href="#">Тарты</a></li>
                  
                </ul>
              </li>
              
              <li className={styles.category} onClick={() => handleCategoryChange([8])}><button>Шоколадные изделия</button></li>
              <li className={styles.category} onClick={() => handleCategoryChange([9])}><button>Подарочные наборы</button></li>
             
            </ul>
       



		</div>
		<div className={styles.right}>

		<div className={styles.product_container}>
		
    
    
    
    {catData
                .filter((item) => selectedCategories.length === 0 || selectedCategories.includes(item.category)) // Фильтрация данных
                .map((item: CatData, index) => (
      <div className={styles.product_card} key={index}>
		  <div className={styles.image_wrapper}>
                {item.img}
              </div>
              <h2>{item.title}</h2>
              <div className={styles.price_weight}>
                <p className={styles.price}>{item.price} ₽</p>
                <p className={styles.weight}>{item.weight} кг</p>
               
              </div>
              <Link href={'/product'}>
              <button>В корзину</button>
              </Link>
            </div>
	))}
          </div>


		</div>

		
        </div>
      </div>
    </div>
  );

  
};





export default Hero;