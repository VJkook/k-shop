import React, {FC, useEffect, useState} from 'react'
import styles from './Hero.module.scss'
import cn from 'classnames'
import {propoData} from '@/screens/main/hero/propo-data'
import {ReadyCake} from "../../../../models/responses/ReadyCake";
import {apiGet, apiPost} from "@/utils/apiInstance";
import {CakeForm} from "../../../../models/responses/CakeForm";
import {Filling} from "../../../../models/responses/Filling";
import {Property} from "csstype";
import Fill = Property.Fill;
import {Coverage} from "../../../../models/responses/Coverage";
import {Decor} from "../../../../models/responses/Decor";
import {router} from "next/client";
import {CakeDesigner} from "../../../../models/responses/CakeDesigner";

;


interface PropoData {
    img: React.ReactNode | null
    title: string
}

interface DecorRequest {
    id: number
    count: number
}

const CakeDesignerForm: FC = () => {
    const [weight, setWeight] = useState(2);
    const [tiers, setTiers] = useState(1);
    const [selectedTab, setSelectedTab] = useState(1);

    const [cakeForms, setCakeForms] = useState<CakeForm[]>([]);
    const [cakeFormId, setCakeFormId] = useState<number>(1);

    const [fillings, setFillings] = useState<Filling[]>([]);
    const [fillingIds, setFillingIds] = useState<number[]>([]);

    const [coverages, setCoverages] = useState<Coverage[]>([]);
    const [coverageId, setCoverageId] = useState<number[]>([]);

    const [decors, setDecors] = useState<Decor[]>([]);
    const [decorRequests, setDecorRequests] = useState<DecorRequest[]>([]);
    const [quantities, setQuantities] = useState<Record<number, number>>({});

    const [description, setDescription] = useState<string>('');

    const [cakeDesigner, setCakeDesigner] = useState<CakeDesigner>(undefined);

    const updateQuantity = (id: number, change: number) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(1, (prev[id] || 1) + change) // Не позволяем количеству быть меньше 1
        }));
    };

    const addFillingId = (id: number) => {
        fillingIds.push(id)
        setFillingIds(fillingIds)
    }

    const addSelectedDecor = (id: number) => {
        let decorRequest = {
            id: id,
            count: quantities[id] || 1
        } as DecorRequest

        decorRequests.push(decorRequest)
        setDecorRequests(decorRequests)
    }

    useEffect(() => {
        loadCakeForms()
        loadFillings()
        loadCoverages()
        loadDecors()
    }, []);

    const loadCakeForms = () => {
        apiGet('/api/cake-forms')
            .then((response) => {
                if (response.data.length) {
                    setCakeForms(response.data)
                }
            }).catch((error) => {
            console.log(error)
        })
    }

    const loadFillings = () => {
        apiGet('/api/fillings')
            .then((response) => {
                if (response.data.length) {
                    setFillings(response.data)
                }
            }).catch((error) => {
            console.log(error)
        })
    }

    const loadCoverages = () => {
        apiGet('/api/coverages')
            .then((response) => {
                if (response.data.length) {
                    setCoverages(response.data)
                }
            }).catch((error) => {
            console.log(error)
        })
    }

    const loadDecors = () => {
        apiGet('/api/decors')
            .then((response) => {
                if (response.data.length) {
                    setDecors(response.data)
                }
            }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        if (cakeDesigner == undefined) {
            return
        }

        apiPost('/api/basket', {
            id_product: cakeDesigner.id_product
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
    }, [cakeDesigner]);
    const addToBasket = () => {
        let cakeDesignerRequest = {
            name: 'Торт из конструктора',
            description: description,
            weight: weight,
            id_coverage: coverageId,
            id_cake_form: cakeFormId,
            filling_ids: fillingIds,
            decors: decorRequests
        } as CakeDesignerRequest

        apiPost('/api/cake-designers', cakeDesignerRequest)
            .then((response) => {
                if (response.data != undefined) {
                    console.log(response.data)
                    setCakeDesigner(response.data)
                }
            }).catch((error) => {
            console.log(error)
        }).finally(() => {

        })
    };

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
                                onChange={(e) => setCakeFormId(e.target.value)}
                            >
                                {cakeForms.map((cakeForm: CakeForm) => (
                                    <option value={cakeForm.id}>{cakeForm.name}</option>
                                ))}

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
                            <div className={styles['selection-title']}>Выберите начинку</div>
                            <div className={styles['selection-container']}>
                                <button className={styles['arrow-button']}>←</button>
                                <div className={styles['selection-options']}>
                                    {fillings.map((item: Filling) => (
                                        <div className={styles['option-item']} onClick={() => addFillingId(item.id)}>
                                            <img src={item.image.url}/>
                                            <span>{item.name}</span><br/>
                                            <span>{item.price_by_kg}р цена за кг</span>
                                        </div>
                                    ))}
                                </div>
                                <button className={styles['arrow-button']}>→</button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.block}>
                        <div className={styles['section-title']}>Остались последние шаги! Выберите покрытие:</div>
                        <div className={styles['options-grid']}>
                            {coverages.map((item: Coverage) => (
                                <div className={styles['grid-item']} onClick={() => setCoverageId(item.id)}>
                                    <img src={item.image.url}/>
                                    <span>{item.name}</span><br/>
                                    <span>{item.price}р цена</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.block}>
                        <div className={styles['section-title']}>
                            Вы можете дополнительно выбрать украшения для вашего тортика
                        </div>
                        <div className={styles['options-grid']}>
                            {decors.map((item: Decor) => (
                                <div className={styles['grid-item']} onClick={() => addSelectedDecor(item.id)}>
                                    <img src={item.image.url}/>
                                    <span>{item.name}</span><br/>
                                    <span>{item.price}р цена</span>
                                    <div className={styles['quantity-control']}>
                                        <button className={styles['quantity-button']}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateQuantity(item.id, +1);
                                                }}
                                        >+
                                        </button>
                                        <span className={styles['quantity-value']}>{quantities[item.id] || 1}</span>
                                        <button className={styles['quantity-button']}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateQuantity(item.id, -1);
                                                }}
                                        >−
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles['comments-section']}>
                        <label htmlFor="comments" onChange={(e) => setDescription(e.target.value)}>
                            Опишите свои пожелания насчет изделия. Чем подробнее, тем лучше.
                        </label>
                        <textarea id="comments" placeholder="Оставьте комментарии ..."/>
                    </div>

                    <hr className={styles.divider}/>

                    <div className={styles.footer}>
                        <div className={styles['footer-note']}>Расчет стоимости изделия предварительный!</div>
                        <div className={styles['footer-total']}>
                            <span>ИТОГО:</span>
                            <span className={styles['total-price']}>??? руб</span>
                            <button className={styles['order-button']} onClick={() => addToBasket()}>
                                Оформить заказ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CakeDesignerForm
