import React, { FC, useState, useEffect } from 'react';
import styles from './CreateRecipe.module.scss';
import instance, { apiGet, apiPost, apiPut, apiDelete } from '@/utils/apiInstance';

interface Ingredient {
    id: number | null;
    name: string;
    quantity: string;
    measurement: string;
}

interface Step {
    id?: number; // Для существующих шагов
    text: string;
    time?: string;
    imageFile?: File | null;
    preview?: string | null;
    imageId?: number | null;
    isNew?: boolean; // Флаг для новых шагов
}

interface Product {
    id: number;
    name: string;
    price?: number;
}

interface EditRecipeProps {
    id: number; // ID редактируемого рецепта
}

const EditRecipe: FC<EditRecipeProps> = ({ id }) => {
    const [recipeName, setRecipeName] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [allIngredients, setAllIngredients] = useState<any[]>([]);
    const [technologicalMapId, setTechnologicalMapId] = useState<number | null>(null);
    const [stepsToDelete, setStepsToDelete] = useState<number[]>([]); // ID шагов для удаления

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
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [steps, setSteps] = useState<Step[]>([]);

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

    // Загрузка данных рецепта и продуктов
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsSubmitting(true);

                // Загрузка данных рецепта
                const recipeResponse = await apiGet(`/api/recipes/${id}`);
                const recipeData = recipeResponse.data;

                setRecipeName(recipeData.name);
                setDescription(recipeData.description);
                setTechnologicalMapId(recipeData.technological_map.id);

                // Установка типа продукта
                if (recipeData.id_ready_cake) {
                    setSelectedReadyCake(recipeData.id_ready_cake);
                } else if (recipeData.id_filling) {
                    setSelectedFilling(recipeData.id_filling);
                } else if (recipeData.id_decor) {
                    setSelectedDecor(recipeData.id_decor);
                }

                // Загрузка ингредиентов
                setIngredients(recipeData.ingredients.map((ing: any) => ({
                    id: ing.id,
                    name: ing.name,
                    quantity: ing.quantity.toString(),
                    measurement: ing.measurement
                })));

                // Загрузка шагов
                setSteps(recipeData.technological_map.cooking_steps.map((step: any) => ({
                    id: step.id,
                    text: step.description,
                    time: step.step_time,
                    preview: step.image?.url || null,
                    imageId: step.image?.id || null
                })));

                // Загрузка продуктов
                const [
                    cakesResponse,
                    fillingsResponse,
                    decorsResponse,
                    coveragesResponse,
                    ingResponse
                ] = await Promise.all([
                    apiGet('/api/ready-cakes'),
                    apiGet('/api/fillings'),
                    apiGet('/api/decors'),
                    apiGet('/api/coverages'),
                    apiGet('/api/ingredients')
                ]);

                if (cakesResponse.data) setReadyCakes(cakesResponse.data);
                if (fillingsResponse.data) setFillings(fillingsResponse.data);
                if (decorsResponse.data) setDecors(decorsResponse.data);
                if (coveragesResponse.data) setCoverages(coveragesResponse.data);
                if (ingResponse.data) setAllIngredients(ingResponse.data);

            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setIsSubmitting(false);
            }
        };

        fetchData();
    }, [id]);

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
        setSteps([...steps, {
            text: '',
            time: '',
            imageFile: null,
            preview: null,
            imageId: null,
            isNew: true
        }]);
    };

    const handleRemoveStep = (index: number) => {
        const step = steps[index];
        if (step.id && !step.isNew) {
            setStepsToDelete([...stepsToDelete, step.id]);
        }

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

        try {
            const imgResponse = await instance.post('/api/images', formData);
            if (imgResponse.status !== 200) {
                throw new Error('Ошибка загрузки изображения');
            }
            return imgResponse.data.id;
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

        // Проверка валидности времени
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

            // 2. Обновляем рецепт
            let recipeEndpoint = '';
            let recipePayload = {};

            switch (productType) {
                case 'ready-cake':
                    recipeEndpoint = `/api/recipes/${id}`;
                    recipePayload = {
                        name: recipeName,
                        description: description,
                        id_ready_cake: selectedReadyCake
                    };
                    break;

                case 'filling':
                    recipeEndpoint = `/api/recipes/${id}`;
                    recipePayload = {
                        name: recipeName,
                        description: description,
                        id_filling: selectedFilling
                    };
                    break;

                case 'decor':
                    recipeEndpoint = `/api/recipes/${id}`;
                    recipePayload = {
                        name: recipeName,
                        description: description,
                        id_decor: selectedDecor
                    };
                    break;

                default:
                    throw new Error('Неизвестный тип продукта');
            }

            await apiPost(recipeEndpoint, recipePayload);

            // 3. Обновляем технологическую карту
            if (technologicalMapId) {
                await apiPost(`/api/technological-maps/${technologicalMapId}`, {
                    name: recipeName,
                    description: description
                });

                // 4. Удаляем помеченные шаги
                for (const stepId of stepsToDelete) {
                    await apiDelete(`/api/technological-maps/${technologicalMapId}/cooking-steps/${stepId}`);
                }

                // 5. Обновляем/добавляем шаги
                for (let i = 0; i < stepsWithImages.length; i++) {
                    const step = stepsWithImages[i];
                    const stepPayload = {
                        description: step.text,
                        step_number: i + 1,
                        step_time: step.time || '00:00:00',
                        id_image: step.imageId || null
                    };

                    if (step.id && !step.isNew) {
                        // Обновляем существующий шаг
                        await apiPost(
                            `/api/technological-maps/${technologicalMapId}/cooking-steps/${step.id}`,
                            stepPayload
                        );
                    } else {
                        // Добавляем новый шаг
                        await apiPost(
                            `/api/technological-maps/${technologicalMapId}/cooking-steps`,
                            stepPayload
                        );
                    }
                }
            }

            // 6. Обновляем ингредиенты
            // Сначала удаляем все текущие ингредиенты
            await apiDelete(`/api/recipes/${id}/ingredients`);

            // Затем добавляем новые
            const ingredientsPayload = ingredients
                .filter(ing => ing.id !== null)
                .map(ing => ({
                    id: ing.id,
                    quantity: parseFloat(ing.quantity)
                }));

            await apiPost(`/api/recipes/${id}/ingredients`, {
                ingredients: ingredientsPayload
            });

            alert('Рецепт успешно обновлен!');

        } catch (error) {
            console.error('Ошибка при обновлении рецепта:', error);
            alert('Произошла ошибка при обновлении рецепта');
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
                <h1 className={styles.recipeForm__title}>Редактирование рецепта</h1>

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
                    <h2 className={styles.recipeForm__sectionTitle}>Тип продукта</h2>
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
                                disabled={isSubmitting}
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
                    {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
            </div>
        </div>
    );
}

export default EditRecipe;
