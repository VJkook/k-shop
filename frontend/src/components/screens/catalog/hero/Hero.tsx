import React, {FC, useState, useEffect, useRef} from 'react';
import styles from './Hero.module.scss';
import cn from 'classnames';
import Image from 'next/image';

import Link from 'next/link'
import Logo1 from '../../../../assets/img/construct3.jpg';
import {catData} from '@/screens/catalog/hero/cat-data'
import {list} from "postcss";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import {apiGet} from "@/utils/apiInstance";

interface CatData {
    img: React.ReactNode | null
    title: string
    price: number
    weight: number
    category: number
}

interface Image {
    id: number
    url: string
}

interface Product {
    id: number
    name: string
    price: number
    weight: number | null
    composition: string | null
    description: string | null
    images: list<Image[]>
}


const Hero: FC = () => {
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoaded, setIsLoaded] = useState<boolean>();
    const [api, setApi] = useState(null)


    useEffect(() => {
        loadProducts()
    }, []);
    const loadProducts = () => {
        apiGet('/api/products')
            .then((response) => {
                if (response.data.length) {
                    setProducts(response.data)
                }
            }).catch((error) => {
            console.log(error)
        })
    }

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
        handleCategoryChange([5, 6, 7]); // Показать все пирожные
    };

    return (
        <div className={cn(styles.base, 'wrapper')}>
            <div className={styles.main_container}>
                <div className={styles.first_box}>
                    <div className={styles.banner}>


                        <ul className={styles.category_list}>
                            <li className={styles.category} onClick={() => handleCategoryChange([])}><a href="#">Все</a>
                            </li>
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

                            <li className={styles.category} onClick={() => handleCategoryChange([8])}>
                                <button>Шоколадные изделия</button>
                            </li>
                            <li className={styles.category} onClick={() => handleCategoryChange([9])}>
                                <button>Подарочные наборы</button>
                            </li>

                        </ul>


                    </div>
                    <div className={styles.right}>
                        <div className={styles.product_container}>


                            {products
                                .filter((item) => selectedCategories.length === 0 || selectedCategories.includes(item.category)) // Фильтрация данных
                                .map((item: Product, index) => (
                                    <div className={styles.product_card} key={index}>
                                        <div className={styles.image_wrapper}>
                                            <img src={item.images && item.images.length > 0 ? item.images[0].url : 'Изображение отсутствует'}/>
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
