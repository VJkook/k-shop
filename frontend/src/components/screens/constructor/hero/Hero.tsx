import React, {FC, useState} from 'react'
import styles from './Hero.module.scss'
import cn from 'classnames'
import { propoData } from '@/screens/main/hero/propo-data'


interface PropoData {
	img: React.ReactNode | null
	title: string
}

const Hero: FC = () => {


    const [weight, setWeight] = useState(2);
    const [tiers, setTiers] = useState(1);
    const [selectedTab, setSelectedTab] = useState(1);
    const [formShape, setFormShape] = useState('квадрат');

    const handleIncrement = () => setWeight((w) => w + 1);
    const handleDecrement = () => setWeight((w) => Math.max(1, w - 1));

    return (
        <div className={styles.container}>
            <div className={styles['flex-container']}>
                <div className={styles.content}>
                    <div className={styles['options-container']}>
                        <div className={styles['option-group']}>
                            <span>Выберите вес</span>
                            <button className={styles['control-button']} onClick={handleIncrement}>+</button>
                            <span className={styles['weight-value']}>{weight} кг</span>
                            <button className={styles['control-button']} onClick={handleDecrement}>−</button>
                        </div>
                        <div className={styles['option-group']}>
                            <span>Кол-во ярусов</span>
                            <div className={styles['tier-buttons']}>
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <button
                                        key={n}
                                        className={cn(styles['tier-button'], {[styles.active]: tiers === n})}
                                        onClick={() => setTiers(n)}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className={styles['option-group']}>
                            <span>Форма торта</span>
                            <select
                                className={styles['form-select']}
                                value={formShape}
                                onChange={(e) => setFormShape(e.target.value)}
                            >
                                <option>квадрат</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles['tier-selection']}>
                        <div className={styles['tier-tabs']}>
                            {[...Array(tiers)].map((_, i) => (
                                <button
                                    key={i}
                                    className={cn(styles['tier-tab'], {[styles.active]: selectedTab === i + 1})}
                                    onClick={() => setSelectedTab(i + 1)}
                                >
                                    {i + 1} ярус
                                </button>
                            ))}
                        </div>

                        <div className={styles['tier-content']}>
                            <div className={styles['selection-title']}>Выберите корж</div>
                            <div className={styles['selection-container']}>
                                <button className={styles['arrow-button']}>←</button>
                                <div className={styles['selection-options']}>
                                    <div className={styles['option-item']}>
                                        <div className={styles['option-image']}/>
                                        <span>Шоколадный</span>
                                    </div>
                                    <div className={styles['option-item']}>
                                        <div className={styles['option-image']}/>
                                        <span>Ванильный</span>
                                    </div>
                                    <div className={styles['option-item']}>
                                        <div className={styles['option-image']}/>
                                        <span>Фисташковый</span>
                                    </div>
                                </div>
                                <button className={styles['arrow-button']}>→</button>
                            </div>

                            <div className={styles['selection-title']}>Выберите начинку</div>
                            <div className={styles['selection-container']}>
                                <button className={styles['arrow-button']}>←</button>
                                <div className={styles['selection-options']}>
                                    <div className={styles['option-item']}>
                                        <div className={styles['option-image']}/>
                                        <span>Ванильный крем</span>
                                    </div>
                                    <div className={styles['option-item']}>
                                        <div className={styles['option-image']}/>
                                        <span>Джем</span>
                                    </div>
                                    <div className={styles['option-item']}>
                                        <div className={styles['option-image']}/>
                                        <span>Свежие фрукты</span>
                                    </div>
                                </div>
                                <button className={styles['arrow-button']}>→</button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.block}>
                        <div className={styles['section-title']}>Остались последние шаги! Выберите покрытие:</div>
                        <div className={styles['options-grid']}>
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className={styles['grid-item']}>
                                    <div className={styles['option-image']}/>
                                    <span>Фисташковый</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.block}>
                        <div className={styles['section-title']}>
                            Вы можете дополнительно выбрать украшения для вашего тортика
                        </div>
                        <div className={styles['options-grid']}>
                            {[0, 0, 10, 0, 0].map((qty, i) => (
                                <div key={i} className={styles['grid-item']}>
                                    <div className={styles['option-image']}/>
                                    <div className={styles['quantity-control']}>
                                        <button className={styles['quantity-button']}>+</button>
                                        <span className={styles['quantity-value']}>{qty}</span>
                                        <button className={styles['quantity-button']}>−</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles['comments-section']}>
                        <label htmlFor="comments">
                            Опишите свои пожелания насчет изделия. Чем подробнее, тем лучше.
                        </label>
                        <textarea id="comments" placeholder="Оставьте комментарии ..."/>
                    </div>

                    <hr className={styles.divider}/>

                    <div className={styles.footer}>
                        <div className={styles['footer-note']}>Расчет стоимости изделия предварительный!</div>
                        <div className={styles['footer-total']}>
                            <span>ИТОГО:</span>
                            <span className={styles['total-price']}>3000 руб</span>
                            <button className={styles['order-button']}>Оформить заказ</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero
