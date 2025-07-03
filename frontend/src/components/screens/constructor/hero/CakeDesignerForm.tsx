import React, {FC, useEffect, useState, useMemo} from 'react';
import styles from './Hero.module.scss';
import cn from 'classnames';
import {apiGet, apiPost} from "@/utils/apiInstance";
import {CakeForm} from "../../../../models/responses/CakeForm";
import {Filling} from "../../../../models/responses/Filling";
import {Coverage} from "../../../../models/responses/Coverage";
import {Decor} from "../../../../models/responses/Decor";
import {router} from "next/client";
import {CakeDesigner} from "../../../../models/responses/CakeDesigner";
import {CakeDesignerRequest, DecorRequest, TierRequest} from "../../../../models/requests/CakeDesignerRequest";

const CakeDesignerForm: FC = () => {
    // Ограничения по весу для разного количества ярусов
    const TIER_WEIGHT_LIMITS = [
        { tiers: 5, minWeight: 12, maxWeight: 15 },
        { tiers: 4, minWeight: 8, maxWeight: 15 },
        { tiers: 3, minWeight: 4, maxWeight: 15 },
        { tiers: 2, minWeight: 3, maxWeight: 15 },
        { tiers: 1, minWeight: 2, maxWeight: 15 }
    ];

    const [weight, setWeight] = useState(2);
    const [tiersCount, setTiersCount] = useState(1);
    const [selectedTab, setSelectedTab] = useState(1);

    const [cakeForms, setCakeForms] = useState<CakeForm[]>([]);
    const [cakeFormId, setCakeFormId] = useState<number>(1);

    const [fillings, setFillings] = useState<Filling[]>([]);
    const [tiers, setTiers] = useState<Record<number, {id_filling: number | null, weight: number}>>({});
    const [selectedFillings, setSelectedFillings] = useState<Record<number, number | null>>({});

    const [coverages, setCoverages] = useState<Coverage[]>([]);
    const [coverageId, setCoverageId] = useState<number>(1);
    const [selectedCoverage, setSelectedCoverage] = useState<number | null>(null);

    const [decors, setDecors] = useState<Decor[]>([]);
    const [decorRequests, setDecorRequests] = useState<DecorRequest[]>([]);
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [selectedDecors, setSelectedDecors] = useState<number[]>([]);

    const [description, setDescription] = useState<string>('');
    const [cakeDesigner, setCakeDesigner] = useState<CakeDesigner>();

    // Функция для расчета веса каждого яруса по формуле: wi = ((W + n(n-1)/2)/n) - (i-1)
    const calculateTierWeights = (totalWeight: number, tiers: number): number[] => {
        const weights: number[] = [];
        const base = (totalWeight + (tiers * (tiers - 1)) / 2) / tiers;

        for (let i = 1; i <= tiers; i++) {
            weights.push(parseFloat((base - (i - 1)).toFixed(2)));
        }

        return weights;
    };

    // Функция для определения доступного количества ярусов
    const getAvailableTiersCount = (currentWeight: number): number => {
        const limit = TIER_WEIGHT_LIMITS.find(limit =>
            currentWeight >= limit.minWeight && currentWeight <= limit.maxWeight
        );
        return limit ? limit.tiers : 1;
    };

    // Обновляем количество ярусов при изменении веса
    useEffect(() => {
        const maxTiers = getAvailableTiersCount(weight);
        if (tiersCount > maxTiers) {
            setTiersCount(maxTiers);
        }
    }, [weight]);

    // Инициализация состояний для ярусов с расчетом веса по формуле
    useEffect(() => {
        const tierWeights = calculateTierWeights(weight, tiersCount);
        const initialTiers: Record<number, {id_filling: number | null, weight: number}> = {};
        const initialSelected: Record<number, number | null> = {};

        for (let i = 1; i <= tiersCount; i++) {
            initialTiers[i] = tiers[i] || {
                id_filling: null,
                weight: tierWeights[i - 1]
            };
            initialSelected[i] = selectedFillings[i] || null;
        }

        setTiers(initialTiers);
        setSelectedFillings(initialSelected);
    }, [tiersCount, weight]);

    // Функция для изменения веса с проверкой ограничений
    const handleWeightChange = (newWeight: number) => {
        const clampedWeight = Math.max(2, Math.min(15, newWeight));
        setWeight(clampedWeight);

        // Обновляем количество ярусов
        const maxTiers = getAvailableTiersCount(clampedWeight);
        if (tiersCount > maxTiers) {
            setTiersCount(maxTiers);
        }
    };

    // Расчет итоговой цены
    const totalPrice = useMemo(() => {
        let price = 0;

        // Стоимость начинок
        Object.values(tiers).forEach(tier => {
            if (tier.id_filling) {
                const filling = fillings.find(f => f.id === tier.id_filling);
                if (filling) {
                    price += filling.price_by_kg * tier.weight;
                }
            }
        });

        // Стоимость покрытия
        const coverage = coverages.find(c => c.id === coverageId);
        if (coverage) {
            price += coverage.price;
        }

        // Стоимость декора
        decorRequests.forEach(decorReq => {
            const decor = decors.find(d => d.id === decorReq.id);
            if (decor) {
                price += decor.price * decorReq.count;
            }
        });

        return parseFloat(price.toFixed(2));
    }, [tiers, fillings, coverageId, coverages, decorRequests, decors]);

    const updateQuantity = (id: number, change: number) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(1, (prev[id] || 1) + change)
        }));
    };

    const addFilling = (tier: number, id: number) => {
        setTiers(prev => ({
            ...prev,
            [tier]: {
                id_filling: id,
                weight: prev[tier]?.weight || weight / tiersCount
            }
        }));

        setSelectedFillings(prev => ({
            ...prev,
            [tier]: id
        }));
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
                    // setBasket(response.data)
                }
            }).catch((error) => {
            console.log(error)
        }).finally(() => {
            router.push('/basket')
        })
    }, [cakeDesigner]);

    const addToBasket = () => {
        // Преобразуем tiers в массив объектов TierRequest
        const tiersRequest: TierRequest[] = Object.entries(tiers)
            .filter(([_, tier]) => tier.id_filling !== null)
            .map(([_, tier]) => ({
                id_filling: tier.id_filling!,
                weight: tier.weight
            }));

        const cakeDesignerRequest: CakeDesignerRequest = {
            name: 'Торт из конструктора',
            description: description,
            weight: weight,
            id_coverage: coverageId,
            id_cake_form: cakeFormId,
            tiers: tiersRequest,
            decors: decorRequests,
            total_cost: totalPrice
        };

        apiPost('/api/cake-designers', cakeDesignerRequest)
            .then((response) => {
                if (response.data != undefined) {
                    console.log(response.data)
                    setCakeDesigner(response.data)
                }
            }).catch((error) => {
            console.log(error)
        })
    };


    const handleIncrement = () => handleWeightChange(weight + 0.5);
    const handleDecrement = () => handleWeightChange(weight - 0.5);

    // Функция для проверки, доступно ли количество ярусов
    const isTierCountAvailable = (count: number) => {
        return count <= getAvailableTiersCount(weight);
    };





    const [fillingPage, setFillingPage] = useState(0);
    const itemsPerPage = 3;

    const startIndex = fillingPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentFillings = fillings.slice(startIndex, endIndex);

    const totalPages = Math.ceil(fillings.length / itemsPerPage);

    return (
        <div className={styles.container}>
            <div className={styles['flex-container']}>
                <div className={styles.content}>
                    <div className={styles['options-container']}>
                        <div className={styles['option-group']}>
                            <span>Выберите вес</span>
                            <button className={styles['control-button']} onClick={handleDecrement}>-</button>
                            <span className={styles['weight-value']}>{weight} кг</span>
                            <button className={styles['control-button']} onClick={handleIncrement}>+</button>
                        </div>
                        <div className={styles['option-group']}>
                            <span>Кол-во ярусов</span>
                            <div className={styles['tier-buttons']}>
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <button
                                        key={n}
                                        className={cn(
                                            styles['tier-button'],
                                            {
                                                [styles.active]: tiersCount === n,
                                                [styles.disabled]: !isTierCountAvailable(n)
                                            }
                                        )}
                                        onClick={() => isTierCountAvailable(n) && setTiersCount(n)}
                                        disabled={!isTierCountAvailable(n)}
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
                            {[...Array(tiersCount)].map((_, i) => {
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
                                <button
                                    className={styles['arrow-button']}
                                    onClick={() => setFillingPage((prev) => Math.max(prev - 1, 0))}
                                    disabled={fillingPage === 0}
                                >
                                    ←
                                </button>

                                <div className={styles['selection-options']}>
                                    {currentFillings.map((item: Filling) => (
                                        <div
                                            key={item.id}
                                            className={cn(
                                                styles['option-item'],styles.card,
                                                { [styles.selected]: selectedFillings[selectedTab] === item.id }
                                            )}
                                            onClick={() => addFilling(selectedTab, item.id)}
                                        >
                                            <img src={item.image.url} alt={item.name} />
                                            <span>{item.name}</span><br />
                                            <span>{item.price_by_kg}р цена за кг</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    className={styles['arrow-button']}
                                    onClick={() => setFillingPage((prev) => Math.min(prev + 1, totalPages - 1))}
                                    disabled={fillingPage >= totalPages - 1}
                                >
                                    →
                                </button>
                            </div>

                        </div>
                    </div>

                    <div className={styles.block}>
                        <div className={styles['section-title']}>Остались последние шаги! Выберите покрытие:</div>
                        <div className={styles['scroll-container']}>
                            {coverages.map((item: Coverage) => (
                                <div
                                    key={item.id}
                                    className={cn(
                                        styles['grid-item'],styles.card,
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
                        <div className={styles['scroll-container']}>
                            {decors.map((item: Decor) => (
                                <div
                                    key={item.id}
                                    className={cn(
                                        styles['grid-item'],styles.card,
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
                                                updateQuantity(item.id, -1);
                                            }}
                                        >-</button>
                                        <span className={styles['quantity-value']}>{quantities[item.id] || 1}</span>
                                        <button
                                            className={styles['quantity-button']}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                updateQuantity(item.id, +1);
                                            }}
                                        >+</button>
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
                            <span className={styles['total-price']}>{totalPrice} руб</span>
                            <button className={styles['order-button']} onClick={addToBasket}>
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
