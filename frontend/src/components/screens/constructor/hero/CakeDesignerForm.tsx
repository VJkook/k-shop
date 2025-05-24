import React, {FC, useEffect, useState} from 'react'
import styles from './Hero.module.scss'
import cn from 'classnames'
import {ReadyCake} from "../../../../models/responses/ReadyCake";
import {apiGet, apiPost} from "@/utils/apiInstance";
import {CakeForm} from "../../../../models/responses/CakeForm";
import {Filling} from "../../../../models/responses/Filling";
import {Coverage} from "../../../../models/responses/Coverage";
import {Decor} from "../../../../models/responses/Decor";
import {router} from "next/client";
import {CakeDesigner} from "../../../../models/responses/CakeDesigner";

interface DecorRequest {
    id: number
    count: number
}

interface CakeDesignerRequest {
    name: string;
    description: string;
    weight: number;
    id_coverage: number;
    id_cake_form: number;
    filling_ids: number[];
    decors: DecorRequest[];
}

const CakeDesignerForm: FC = () => {
    const [weight, setWeight] = useState(2);
    const [tiers, setTiers] = useState(1);
    const [selectedTab, setSelectedTab] = useState(1);

    const [cakeForms, setCakeForms] = useState<CakeForm[]>([]);
    const [cakeFormId, setCakeFormId] = useState<number>(1);

    const [fillings, setFillings] = useState<Filling[]>([]);
    const [fillingIds, setFillingIds] = useState<Record<number, number[]>>({}); // { tier: [fillingIds] }
    const [selectedFillings, setSelectedFillings] = useState<Record<number, number[]>>({}); // { tier: [fillingIds] }

    const [coverages, setCoverages] = useState<Coverage[]>([]);
    const [coverageId, setCoverageId] = useState<number>(1);
    const [selectedCoverage, setSelectedCoverage] = useState<number | null>(null);

    const [decors, setDecors] = useState<Decor[]>([]);
    const [decorRequests, setDecorRequests] = useState<DecorRequest[]>([]);
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [selectedDecors, setSelectedDecors] = useState<number[]>([]);

    const [description, setDescription] = useState<string>('');
    const [cakeDesigner, setCakeDesigner] = useState<CakeDesigner>();

    // Инициализация состояний для ярусов
    useEffect(() => {
        const initialFillings: Record<number, number[]> = {};
        for (let i = 1; i <= tiers; i++) {
            initialFillings[i] = fillingIds[i] || [];
        }
        setFillingIds(initialFillings);
        setSelectedFillings(initialFillings);
    }, [tiers]);

    const updateQuantity = (id: number, change: number) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(1, (prev[id] || 1) + change)
        }));
    };

    const addFillingId = (tier: number, id: number) => {
        setFillingIds(prev => {
            const newFillings = {...prev};
            newFillings[tier] = newFillings[tier]?.includes(id)
                ? newFillings[tier].filter(fId => fId !== id)
                : [...(newFillings[tier] || []), id];
            return newFillings;
        });

        setSelectedFillings(prev => {
            const newSelected = {...prev};
            newSelected[tier] = newSelected[tier]?.includes(id)
                ? newSelected[tier].filter(fId => fId !== id)
                : [...(newSelected[tier] || []), id];
            return newSelected;
        });
    };

    const addSelectedDecor = (id: number) => {
        const currentCount = quantities[id] || 1;
        const newDecorRequests = decorRequests.some(d => d.id === id)
            ? decorRequests.filter(d => d.id !== id)
            : [...decorRequests, { id, count: currentCount }];

        setDecorRequests(newDecorRequests);
        setSelectedDecors(newDecorRequests.map(d => d.id));
    };

    const handleCoverageSelect = (id: number) => {
        setCoverageId(id);
        setSelectedCoverage(id);
    };

    useEffect(() => {
        loadCakeForms();
        loadFillings();
        loadCoverages();
        loadDecors();
    }, []);

    const loadCakeForms = () => {
        apiGet('/api/cake-forms')
            .then((response) => {
                if (response.data.length) {
                    setCakeForms(response.data);
                }
            }).catch((error) => {
            console.log(error);
        });
    };

    const loadFillings = () => {
        apiGet('/api/fillings')
            .then((response) => {
                if (response.data.length) {
                    setFillings(response.data);
                }
            }).catch((error) => {
            console.log(error);
        });
    };

    const loadCoverages = () => {
        apiGet('/api/coverages')
            .then((response) => {
                if (response.data.length) {
                    setCoverages(response.data);
                }
            }).catch((error) => {
            console.log(error);
        });
    };

    const loadDecors = () => {
        apiGet('/api/decors')
            .then((response) => {
                if (response.data.length) {
                    setDecors(response.data);
                }
            }).catch((error) => {
            console.log(error);
        });
    };

    useEffect(() => {
        if (cakeDesigner == undefined) {
            return;
        }

        apiPost('/api/basket', {
            id_product: cakeDesigner.id_product
        })
            .then((response) => {
                if (response.data != undefined) {
                    // setBasket(response.data);
                }
            }).catch((error) => {
            console.log(error);
        }).finally(() => {
            router.push('/basket');
        });
    }, [cakeDesigner]);

    const addToBasket = () => {
        // Собираем все filling_ids из всех ярусов
        const allFillingIds = Object.values(fillingIds).flat();

        let cakeDesignerRequest: CakeDesignerRequest = {
            name: 'Торт из конструктора',
            description: description,
            weight: weight,
            id_coverage: coverageId,
            id_cake_form: cakeFormId,
            filling_ids: allFillingIds,
            decors: decorRequests
        };

        apiPost('/api/cake-designers', cakeDesignerRequest)
            .then((response) => {
                if (response.data != undefined) {
                    console.log(response.data);
                    setCakeDesigner(response.data);
                }
            }).catch((error) => {
            console.log(error);
        });
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
                                value={cakeFormId}
                                onChange={(e) => setCakeFormId(Number(e.target.value))}
                            >
                                {cakeForms.map((cakeForm: CakeForm) => (
                                    <option key={cakeForm.id} value={cakeForm.id}>{cakeForm.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles['tier-selection']}>
                        <div className={styles['tier-tabs']}>
                            {[...Array(tiers)].map((_, i) => {
                                const tierNumber = i + 1;
                                return (
                                    <button
                                        key={tierNumber}
                                        className={cn(styles['tier-tab'], {[styles.active]: selectedTab === tierNumber})}
                                        onClick={() => setSelectedTab(tierNumber)}
                                    >
                                        {tierNumber} ярус
                                    </button>
                                );
                            })}
                        </div>

                        <div className={styles['tier-content']}>
                            <div className={styles['selection-title']}>Выберите начинку для {selectedTab} яруса</div>
                            <div className={styles['selection-container']}>
                                <button className={styles['arrow-button']}>←</button>
                                <div className={styles['selection-options']}>
                                    {fillings.map((item: Filling) => (
                                        <div
                                            key={item.id}
                                            className={cn(
                                                styles['option-item'],
                                                {[styles.selected]: (selectedFillings[selectedTab] || []).includes(item.id)}
                                            )}
                                            onClick={() => addFillingId(selectedTab, item.id)}
                                        >
                                            <img src={item.image.url} alt={item.name}/>
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
                                <div
                                    key={item.id}
                                    className={cn(
                                        styles['grid-item'],
                                        {[styles.selected]: selectedCoverage === item.id}
                                    )}
                                    onClick={() => handleCoverageSelect(item.id)}
                                >
                                    <img src={item.image.url} alt={item.name}/>
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
                                <div
                                    key={item.id}
                                    className={cn(
                                        styles['grid-item'],
                                        {[styles.selected]: selectedDecors.includes(item.id)}
                                    )}
                                    onClick={() => addSelectedDecor(item.id)}
                                >
                                    <img src={item.image.url} alt={item.name}/>
                                    <span>{item.name}</span><br/>
                                    <span>{item.price}р цена</span>
                                    <div
                                        className={styles['quantity-control']}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            className={styles['quantity-button']}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                updateQuantity(item.id, +1);
                                            }}
                                        >+</button>
                                        <span className={styles['quantity-value']}>{quantities[item.id] || 1}</span>
                                        <button
                                            className={styles['quantity-button']}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                updateQuantity(item.id, -1);
                                            }}
                                        >−</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles['comments-section']}>
                        <label htmlFor="comments">
                            Опишите свои пожелания насчет изделия. Чем подробнее, тем лучше.
                        </label>
                        <textarea
                            id="comments"
                            placeholder="Оставьте комментарии ..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <hr className={styles.divider}/>

                    <div className={styles.footer}>
                        <div className={styles['footer-note']}>Расчет стоимости изделия предварительный!</div>
                        <div className={styles['footer-total']}>
                            <span>ИТОГО:</span>
                            <span className={styles['total-price']}>??? руб</span>
                            <button className={styles['order-button']} onClick={addToBasket}>
                                Оформить заказ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CakeDesignerForm;
