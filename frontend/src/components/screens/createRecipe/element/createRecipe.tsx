import React, { FC, useState, useEffect } from 'react';
import styles from './CreateRecipe.module.scss';
import instance, { apiGet, apiPost } from '@/utils/apiInstance';

interface Ingredient {
    id: number | null;
    name: string;
    quantity: string;
    measurement: string;
}

interface Step {
    text: string;
    time?: string;
    imageFile?: File | null;
    preview?: string | null;
    imageId?: number | null;
}

interface Product {
    id: number;
    name: string;
    price?: number;
}

const CreateRecipe: FC = () => {
    const [recipeName, setRecipeName] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [allIngredients, setAllIngredients] = useState<any[]>([]);


    // Продукты для рецептов
    const [readyCakes, setReadyCakes] = useState<Product[]>([]);
    const [fillings, setFillings] = useState<Product[]>([]);
    const [decors, setDecors] = useState<Product[]>([]);
    const [coverages, setCoverages] = useState<Product[]>([]);

    // Выбранные продукты
    const [selectedReadyCake, setSelectedReadyCake] = useState<number | null>(null);
    const [selectedFilling, setSelectedFilling] = useState<number | null>(null);
    const [selectedDecor, setSelectedDecor] = useState<number | null>(null);
    const [selectedCoverage, setSelectedCoverage] = useState<number | null>(null);

    // Ингредиенты и шаги
    const [ingredients, setIngredients] = useState<Ingredient[]>([
        { id: null, name: '', quantity: '', measurement: '' }
    ]);
    const [steps, setSteps] = useState<Step[]>([
        { text: '', time: '', imageFile: null, preview: null, imageId: null }
    ]);

    // Функция форматирования ввода времени
    const formatTimeInput = (value: string) => {
        const digits = value.replace(/\D/g, '');
        const limited = digits.slice(0, 6);

        let formatted = '';
        for (let i = 0; i < limited.length; i++) {
            if (i === 2 || i === 4) formatted += ':';
            formatted += limited[i];
        }

        return formatted;
    };

    // Проверка валидности времени
    const isValidTime = (time: string) => {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
        return timeRegex.test(time);
    };

    // Загрузка продуктов для рецептов
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Загрузка готовых тортов
                const cakesResponse = await apiGet('/api/ready-cakes');
                if (cakesResponse.data) {
                    setReadyCakes(cakesResponse.data);
                }

                // Загрузка начинок
                const fillingsResponse = await apiGet('/api/fillings');
                if (fillingsResponse.data) {
                    setFillings(fillingsResponse.data);
                }

                // Загрузка декоров
                const decorsResponse = await apiGet('/api/decors');
                if (decorsResponse.data) {
                    setDecors(decorsResponse.data);
                }

                // Загрузка покрытий
                const coveragesResponse = await apiGet('/api/coverages');
                if (coveragesResponse.data) {
                    setCoverages(coveragesResponse.data);
                }

                // Загрузка ингредиентов
                const ingResponse = await apiGet('/api/ingredients');
                if (ingResponse.data) {
                    setAllIngredients(ingResponse.data);
                }
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }
        };

        fetchData();
    }, []);

    // Обработчики для ингредиентов
    const handleAddIngredient = () => {
        setIngredients([...ingredients, { id: null, name: '', quantity: '', measurement: '' }]);
    };

    const handleRemoveIngredient = (index: number) => {
        const updated = [...ingredients];
        updated.splice(index, 1);
        setIngredients(updated);
    };

    const handleIngredientChange = (index: number, value: string) => {
        const updated = [...ingredients];
        const selectedId = Number(value);
        const selectedIng = allIngredients.find(ing => ing.id === selectedId);

        if (selectedIng) {
            updated[index] = {
                id: selectedId,
                name: selectedIng.name,
                quantity: updated[index].quantity,
                measurement: selectedIng.measurement
            };
        } else {
            updated[index] = {
                id: null,
                name: '',
                quantity: updated[index].quantity,
                measurement: ''
            };
        }

        setIngredients(updated);
    };

    const handleQuantityChange = (index: number, value: string) => {
        const updated = [...ingredients];
        updated[index].quantity = value;
        setIngredients(updated);
    };

    // Обработчики для шагов
    const handleAddStep = () => {
        setSteps([...steps, { text: '', time: '', imageFile: null, preview: null, imageId: null }]);
    };

    const handleRemoveStep = (index: number) => {
        const updated = [...steps];
        updated.splice(index, 1);
        setSteps(updated);
    };

    const handleStepChange = (index: number, value: string) => {
        const updated = [...steps];
        updated[index].text = value;
        setSteps(updated);
    };

    const handleStepTimeChange = (index: number, value: string) => {
        const formattedValue = formatTimeInput(value);
        const updated = [...steps];
        updated[index].time = formattedValue;
        setSteps(updated);
    };

    const handleStepImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                const updatedSteps = [...steps];
                updatedSteps[index] = {
                    ...updatedSteps[index],
                    imageFile: file,
                    preview: reader.result as string,
                    imageId: null
                };
                setSteps(updatedSteps);
            };

            reader.readAsDataURL(file);
        }
    };

    // Функция загрузки изображения на сервер
    const uploadImage = async (file: File): Promise<number> => {
        const formData = new FormData();
        formData.append('image', file);

        let imageId;
        try {
            const imgResponse = await instance.post('/api/images', formData);
            imageId = imgResponse.data.id;
            if (imgResponse.status != 200) {
                throw new Error('Ошибка загрузки изображения');
            }

            return imageId;
        } catch (error) {
            console.error('Ошибка загрузки изображения:', error);
            throw error;
        }
    };

    // Сброс выбора при изменении типа продукта
    const resetProductSelection = (exclude: string) => {
        if (exclude !== 'cake') setSelectedReadyCake(null);
        if (exclude !== 'filling') setSelectedFilling(null);
        if (exclude !== 'decor') setSelectedDecor(null);
        if (exclude !== 'coverage') setSelectedCoverage(null);
    };

    // Отправка формы
    const handleSubmit = async () => {
        // Проверка выбора продукта
        const productType =
            selectedReadyCake ? 'ready-cake' :
                selectedFilling ? 'filling' :
                    selectedDecor ? 'decor' :
                        null;

        if (!productType) {
            alert('Выберите тип продукта для рецепта!');
            return;
        }

        // Проверка валидности времени во всех шагах
        const hasInvalidTime = steps.some(step =>
            step.time && step.time.length > 0 && !isValidTime(step.time)
        );

        if (hasInvalidTime) {
            alert('Пожалуйста, исправьте неверные форматы времени (должен быть HH:MM:SS)');
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Загрузка изображений для шагов
            const stepsWithImages = [...steps];
            for (let i = 0; i < stepsWithImages.length; i++) {
                const step = stepsWithImages[i];
                if (step.imageFile) {
                    try {
                        const imageId = await uploadImage(step.imageFile);
                        stepsWithImages[i] = { ...step, imageId };
                    } catch (error) {
                        console.error(`Ошибка загрузки изображения для шага ${i + 1}`, error);
                        alert(`Не удалось загрузить изображение для шага ${i + 1}`);
                        setIsSubmitting(false);
                        return;
                    }
                }
            }

            // 2. Создаем рецепт
            let recipeResponse;
            let recipeId;

            switch (productType) {
                case 'ready-cake':
                    recipeResponse = await apiPost('/api/recipes/ready-cakes', {
                        name: recipeName,
                        description: description,
                        id_ready_cake: selectedReadyCake
                    });
                    break;

                case 'filling':
                    recipeResponse = await apiPost('/api/recipes/fillings', {
                        name: recipeName,
                        description: description,
                        id_filling: selectedFilling
                    });
                    break;

                case 'decor':
                    recipeResponse = await apiPost('/api/recipes/decors', {
                        name: recipeName,
                        description: description,
                        id_decor: selectedDecor
                    });
                    break;

                default:
                    throw new Error('Неизвестный тип продукта');
            }

            if (!recipeResponse.data || !recipeResponse.data.id) {
                throw new Error('Не удалось создать рецепт');
            }

            recipeId = recipeResponse.data.id;

            // 3. Создаем технологическую карту
            const mapResponse = await apiPost('/api/technological-maps', {
                name: recipeName,
                description: description
            });

            if (!mapResponse.data || !mapResponse.data.id) {
                throw new Error('Не удалось создать технологическую карту');
            }

            const mapId = mapResponse.data.id;

            // 4. Добавляем шаги приготовления
            for (let i = 0; i < stepsWithImages.length; i++) {
                const step = stepsWithImages[i];

                await apiPost(`/api/technological-maps/${mapId}/cooking-steps`, {
                    description: step.text,
                    step_time: step.time || '00:00:00',
                    id_image: step.imageId || null,
                    step_number: i + 1
                });
            }

            // 5. Привязываем карту к рецепту
            await apiPost(`/api/recipes/${recipeId}/add-technological-map`, {
                id_technological_map: mapId
            });

            // 6. Добавляем ингредиенты
            const ingredientsPayload = ingredients
                .filter(ing => ing.id !== null)
                .map(ing => ({
                    id: ing.id,
                    quantity: parseFloat(ing.quantity)
                }));

            await apiPost(`/api/recipes/${recipeId}/ingredients`, {
                ingredients: ingredientsPayload
            });

            alert('Рецепт успешно создан!');

        } catch (error) {
            console.error('Ошибка при создании рецепта:', error);
            alert('Произошла ошибка при создании рецепта');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Проверка, выбран ли хоть один продукт
    const isProductSelected =
        selectedReadyCake !== null ||
        selectedFilling !== null ||
        selectedDecor !== null ||
        selectedCoverage !== null;

    return (
        <div className={styles.recipeForm}>
            <div className={styles.recipeForm__container}>
                <h1 className={styles.recipeForm__title}>Создание рецепта</h1>

                <section className={styles.recipeForm__section}>
                    <h2 className={styles.recipeForm__sectionTitle}>Основная информация</h2>
                    <div className={styles.recipeForm__sectionContent}>
                        <div>
                            <label className={styles.recipeForm__label}>
                                Название рецепта <span className={styles.recipeForm__required}>*</span>
                            </label>
                            <input
                                type="text"
                                className={styles.recipeForm__input}
                                value={recipeName}
                                onChange={(e) => setRecipeName(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label className={styles.recipeForm__label}>Описание</label>
                            <textarea
                                rows={4}
                                placeholder="Краткое описание рецепта..."
                                className={styles.recipeForm__textarea}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </section>

                <section className={styles.recipeForm__section}>
                    <h2 className={styles.recipeForm__sectionTitle}>Выберите тип продукта</h2>
                    <div className={styles.productSelection}>
                        <div className={styles.productType}>
                            <h3>Готовые торты</h3>
                            <select
                                className={styles.recipeForm__select}
                                value={selectedReadyCake || ''}
                                onChange={(e) => {
                                    setSelectedReadyCake(Number(e.target.value));
                                    resetProductSelection('cake');
                                }}
                                disabled={isSubmitting}
                            >
                                <option value="">Выберите торт</option>
                                {readyCakes.map(cake => (
                                    <option key={cake.id} value={cake.id}>
                                        {cake.name} {cake.price && `- ${cake.price} руб.`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.productType}>
                            <h3>Начинки</h3>
                            <select
                                className={styles.recipeForm__select}
                                value={selectedFilling || ''}
                                onChange={(e) => {
                                    setSelectedFilling(Number(e.target.value));
                                    resetProductSelection('filling');
                                }}
                                disabled={isSubmitting}
                            >
                                <option value="">Выберите начинку</option>
                                {fillings.map(filling => (
                                    <option key={filling.id} value={filling.id}>
                                        {filling.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.productType}>
                            <h3>Декоры</h3>
                            <select
                                className={styles.recipeForm__select}
                                value={selectedDecor || ''}
                                onChange={(e) => {
                                    setSelectedDecor(Number(e.target.value));
                                    resetProductSelection('decor');
                                }}
                                disabled={isSubmitting}
                            >
                                <option value="">Выберите декор</option>
                                {decors.map(decor => (
                                    <option key={decor.id} value={decor.id}>
                                        {decor.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.productType}>
                            <h3>Покрытия</h3>
                            <select
                                className={styles.recipeForm__select}
                                value={selectedCoverage || ''}
                                onChange={(e) => {
                                    setSelectedCoverage(Number(e.target.value));
                                    resetProductSelection('coverage');
                                }}
                            >
                                <option value="">Выберите покрытие</option>
                                {coverages.map(coverage => (
                                    <option key={coverage.id} value={coverage.id}>
                                        {coverage.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                <section className={styles.recipeForm__section}>
                    <div className={styles.recipeForm__sectionHeader}>
                        <h2 className={styles.recipeForm__sectionTitle}>Ингредиенты</h2>
                        <button
                            type="button"
                            onClick={handleAddIngredient}
                            className={styles.recipeForm__buttonAdd}
                            disabled={isSubmitting}
                        >
                            Добавить ингредиент
                        </button>
                    </div>

                    <div className={styles.recipeForm__list}>
                        {ingredients.map((ingredient, index) => (
                            <div key={index} className={styles.ingredientRow}>
                                <select
                                    className={styles.recipeForm__select}
                                    value={ingredient.id || ''}
                                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                                    disabled={isSubmitting}
                                >
                                    <option value="">Выберите ингредиент</option>
                                    {allIngredients.map(ing => (
                                        <option key={ing.id} value={ing.id}>
                                            {ing.name} ({ing.measurement})
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    placeholder="Количество"
                                    className={styles.ingredientWeight}
                                    value={ingredient.quantity}
                                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                                    min="0"
                                    step="0.01"
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    className={styles.recipeForm__buttonRemove}
                                    onClick={() => handleRemoveIngredient(index)}
                                    disabled={isSubmitting}
                                >
                                    x
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.recipeForm__section}>
                    <div className={styles.recipeForm__sectionHeader}>
                        <h2 className={styles.recipeForm__sectionTitle}>
                            Шаги приготовления
                        </h2>
                        <button
                            type="button"
                            onClick={handleAddStep}
                            className={styles.recipeForm__buttonAdd}
                            disabled={isSubmitting}
                        >
                            Добавить шаг
                        </button>
                    </div>
                    <div className={styles.recipeForm__list}>
                        {steps.map((step, index) => (
                            <div key={index} className={styles.recipeForm__stepRow}>
                                <textarea
                                    rows={3}
                                    placeholder={`Шаг ${index + 1}`}
                                    className={styles.recipeForm__textarea}
                                    value={step.text}
                                    onChange={(e) => handleStepChange(index, e.target.value)}
                                    disabled={isSubmitting}
                                />
                                <div className={styles.widgt}>
                                    <input
                                        type="text"
                                        placeholder="Время (HH:MM:SS)"
                                        className={`${styles.timeInput} ${
                                            step.time && step.time.length > 0 && !isValidTime(step.time)
                                                ? styles.timeInputError
                                                : ''
                                        }`}
                                        value={step.time || ''}
                                        onChange={(e) => handleStepTimeChange(index, e.target.value)}
                                        maxLength={8}
                                        disabled={isSubmitting}
                                    />
                                    {step.time && step.time.length > 0 && !isValidTime(step.time) && (
                                        <div className={styles.timeError}>
                                            Неверный формат времени (HH:MM:SS)
                                        </div>
                                    )}
                                </div>
                                <div className={styles.image_wrapper}>
                                    {step.preview ? (
                                        <div className={styles.image_container}>
                                            <img
                                                src={step.preview}
                                                alt="Предпросмотр"
                                                className={styles.img}
                                            />
                                            <button
                                                type="button"
                                                className={styles.remove_image}
                                                onClick={() => {
                                                    const updated = [...steps];
                                                    updated[index] = {
                                                        ...updated[index],
                                                        preview: null,
                                                        imageFile: null,
                                                        imageId: null
                                                    };
                                                    setSteps(updated);
                                                }}
                                                disabled={isSubmitting}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : (
                                        <label className={styles.upload_area}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleStepImageChange(index, e)}
                                                className={styles.upload_input}
                                                disabled={isSubmitting}
                                            />
                                            📷
                                        </label>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    className={styles.recipeForm__buttonRemove}
                                    onClick={() => handleRemoveStep(index)}
                                    disabled={isSubmitting}
                                >
                                    x
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className={styles.recipeForm__buttonCreate}
                    disabled={!isProductSelected || !recipeName || isSubmitting}
                >
                    {isSubmitting ? 'Создание...' : 'Создать рецепт'}
                </button>
            </div>
        </div>
    );
}

export default CreateRecipe;
