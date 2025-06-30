import React, {FC, useState} from 'react';
import styles from './Hero.module.scss';
import cn from 'classnames';
import instance, {apiPost} from "@/utils/apiInstance";
import {router} from "next/client";

const CreateCake: FC = () => {
    // Данные для торта
    const [cakeData, setCakeData] = useState({
        name: '',
        price: '',
        composition: '',
        description: ''
    });

    // Данные для рецепта
    const [recipeData, setRecipeData] = useState({
        name: '',
        description: ''
    });

    // Данные для технологической карты
    const [techMapData, setTechMapData] = useState({
        name: '',
        description: '',
        steps: [{
            description: '',
            step_time: '',
            step_number: 1
        }]
    });

    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [timeErrors, setTimeErrors] = useState<{ [key: number]: string }>({});

    // Функция для валидации времени
    const validateTime = (time: string): boolean => {
        const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
        return regex.test(time);
    };

    const handleCakeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setCakeData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRecipeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setRecipeData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTechMapInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setTechMapData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleStepChange = (index: number, field: string, value: string) => {
        const updatedSteps = [...techMapData.steps];
        updatedSteps[index] = {
            ...updatedSteps[index],
            [field]: value
        };
        setTechMapData(prev => ({
            ...prev,
            steps: updatedSteps
        }));

        // Валидация времени при изменении
        if (field === 'step_time') {
            if (!validateTime(value)) {
                setTimeErrors(prev => ({
                    ...prev,
                    [index]: 'Неверный формат времени. Используйте ЧЧ:ММ:СС (например, 03:30:00)'
                }));
            } else {
                setTimeErrors(prev => {
                    const newErrors = {...prev};
                    delete newErrors[index];
                    return newErrors;
                });
            }
        }
    };

    const addStep = () => {
        setTechMapData(prev => ({
            ...prev,
            steps: [
                ...prev.steps,
                {
                    description: '',
                    step_time: '',
                    step_number: prev.steps.length + 1
                }
            ]
        }));
    };

    const removeStep = (index: number) => {
        if (techMapData.steps.length <= 1) return;
        const updatedSteps = techMapData.steps.filter((_, i) => i !== index)
            .map((step, i) => ({...step, step_number: i + 1}));
        setTechMapData(prev => ({
            ...prev,
            steps: updatedSteps
        }));

        // Удаляем ошибку при удалении шага
        setTimeErrors(prev => {
            const newErrors = {...prev};
            delete newErrors[index];
            return newErrors;
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Валидация времени перед отправкой
        let hasTimeError = false;
        const newTimeErrors: { [key: number]: string } = {};

        techMapData.steps.forEach((step, index) => {
            if (!validateTime(step.step_time)) {
                newTimeErrors[index] = 'Неверный формат времени. Используйте ЧЧ:ММ:СС (например, 03:30:00)';
                hasTimeError = true;
            }
        });

        if (hasTimeError) {
            setTimeErrors(newTimeErrors);
            alert('Пожалуйста, исправьте ошибки в полях времени');
            return;
        }

        // Остальная валидация
        if (!cakeData.name || !cakeData.price || !cakeData.composition || !cakeData.description) {
            alert('Пожалуйста, заполните все обязательные поля информации о торте');
            return;
        }

        if (!recipeData.name || !recipeData.description) {
            alert('Пожалуйста, заполните все поля рецепта');
            return;
        }

        if (!techMapData.name || !techMapData.description) {
            alert('Пожалуйста, заполните все поля технологической карты');
            return;
        }

        for (const step of techMapData.steps) {
            if (!step.description) {
                alert('Пожалуйста, заполните все поля шагов технологической карты');
                return;
            }
        }

        setIsLoading(true);

        try {
            // 1. Загружаем изображение
            let imageId;
            if (image) {
                const formDataImg = new FormData();
                formDataImg.append('image', image);

                const imgResponse = await instance.post('/api/images', formDataImg);
                imageId = imgResponse.data.id;
            }

            // 2. Создаем торт
            const cakeResponse = await apiPost('/api/ready-cakes', {
                name: cakeData.name,
                price: parseFloat(cakeData.price),
                composition: cakeData.composition,
                description: cakeData.description
            });
            const cakeId = cakeResponse.data.id;

            // 3. Связываем изображение с тортом
            if (imageId) {
                await apiPost('/api/ready-cake-image-relations', {
                    id_image: imageId,
                    id_ready_cake: cakeId
                });
            }

            // 4. Создаем рецепт
            const recipeResponse = await apiPost('/api/recipes/ready-cakes', {
                name: recipeData.name,
                description: recipeData.description,
                id_ready_cake: cakeId
            });
            const recipeId = recipeResponse.data.id;

            // 5. Создаем технологическую карту
            const techMapResponse = await apiPost('/api/technological-maps', {
                name: techMapData.name,
                description: techMapData.description
            });
            const techMapId = techMapResponse.data.id;

            // 6. Добавляем шаги тех. карты
            if (techMapId) {
                for (const step of techMapData.steps) {
                    await apiPost(`/api/technological-maps/${techMapId}/cooking-steps`, {
                        description: step.description,
                        step_time: step.step_time,
                        id_image: imageId,
                        step_number: step.step_number
                    });
                }
            }

            // 7. Привязываем технологическую карту к рецепту
            if (recipeId && techMapId) {
                await apiPost(`/api/recipes/${recipeId}/add-technological-map`, {
                    id_technological_map: techMapId
                });
            }

            // Перенаправляем после успешного создания
            router.push('/catalog');
        } catch (error) {
            console.error('Ошибка при создании товара:', error);
            alert('Произошла ошибка при создании торта');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn(styles.base, 'wrapper')}>
            <div className={styles.main_container}>
                <div className={styles.first_box}>
                    <h1 className={styles.page_title}>Создание нового торта</h1>

                    <form onSubmit={handleSubmit} className={styles.banner}>
                        {/* Секция с основной информацией о торте */}
                        <div className={styles.order_header}>
                            <h2>Основная информация</h2>
                        </div>

                        <div className={styles.product}>
                            <div className={styles.image_wrapper}>
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Предпросмотр"
                                        className={styles.img}
                                    />
                                ) : (
                                    <label className={styles.upload_area}>
                                        <span>+ Добавить изображение</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className={styles.upload_input}
                                        />
                                    </label>
                                )}
                            </div>

                            <div className={styles.main_details}>
                                <div className={styles.details}>
                                    <div className={styles.form_group}>
                                        <label>Название торта</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={cakeData.name}
                                            onChange={handleCakeInputChange}
                                            className={styles.form_input}
                                            required
                                        />
                                    </div>

                                    <div className={styles.form_group}>
                                        <label>Цена (₽/кг)</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={cakeData.price}
                                            onChange={handleCakeInputChange}
                                            className={styles.form_input}
                                            step="0.01"
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className={styles.form_group}>
                                        <label>Состав</label>
                                        <input
                                            type="text"
                                            name="composition"
                                            value={cakeData.composition}
                                            onChange={handleCakeInputChange}
                                            className={styles.form_input}
                                            required
                                        />
                                    </div>

                                    <div className={styles.form_group}>
                                        <label>Описание</label>
                                        <textarea
                                            name="description"
                                            value={cakeData.description}
                                            onChange={handleCakeInputChange}
                                            className={styles.form_textarea}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Секция с рецептом */}
                        <div className={styles.order_header} style={{marginTop: '20px'}}>
                            <h2>Рецепт</h2>
                        </div>

                        <div className={styles.product}>
                            <div className={styles.main_details}>
                                <div className={styles.details}>
                                    <div className={styles.form_group}>
                                        <label>Название рецепта</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={recipeData.name}
                                            onChange={handleRecipeInputChange}
                                            className={styles.form_input}
                                            required
                                        />
                                    </div>

                                    <div className={styles.form_group}>
                                        <label>Описание рецепта</label>
                                        <textarea
                                            name="description"
                                            value={recipeData.description}
                                            onChange={handleRecipeInputChange}
                                            className={styles.form_textarea}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Секция с технологической картой */}
                        <div className={styles.order_header} style={{marginTop: '20px'}}>
                            <h2>Технологическая карта</h2>
                        </div>

                        <div className={styles.product}>
                            <div className={styles.main_details}>
                                <div className={styles.details}>
                                    <div className={styles.form_group}>
                                        <label>Название технологической карты</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={techMapData.name}
                                            onChange={handleTechMapInputChange}
                                            className={styles.form_input}
                                            required
                                        />
                                    </div>

                                    <div className={styles.form_group}>
                                        <label>Описание технологической карты</label>
                                        <textarea
                                            name="description"
                                            value={techMapData.description}
                                            onChange={handleTechMapInputChange}
                                            className={styles.form_textarea}
                                            required
                                        />
                                    </div>

                                    <div className={styles.form_group}>
                                        <label>Шаги приготовления</label>
                                        {techMapData.steps.map((step, index) => (
                                            <div key={index} style={{marginBottom: '15px', border: '1px solid #eee', padding: '10px', borderRadius: '5px'}}>
                                                <div className={styles.form_group}>
                                                    <label>Шаг {step.step_number}</label>
                                                    {techMapData.steps.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeStep(index)}
                                                            style={{float: 'right', background: '#ff4444', color: 'white', border: 'none', borderRadius: '3px', padding: '2px 5px'}}
                                                        >
                                                            Удалить
                                                        </button>
                                                    )}
                                                </div>
                                                <div className={styles.form_group}>
                                                    <label>Описание шага</label>
                                                    <textarea
                                                        value={step.description}
                                                        onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                                                        className={styles.form_textarea}
                                                        required
                                                    />
                                                </div>
                                                <div className={styles.form_group}>
                                                    <label>Время выполнения (чч:мм:сс)</label>
                                                    <input
                                                        type="text"
                                                        value={step.step_time}
                                                        onChange={(e) => handleStepChange(index, 'step_time', e.target.value)}
                                                        className={styles.form_input}
                                                        placeholder="03:30:00"
                                                        required
                                                    />
                                                    {timeErrors[index] && (
                                                        <div style={{color: 'red', fontSize: '0.8rem', marginTop: '5px'}}>
                                                            {timeErrors[index]}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addStep}
                                            style={{background: '#4CAF50', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px'}}
                                        >
                                            + Добавить шаг
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.form_actions}>
                            <button
                                type="submit"
                                className={styles.submit_button}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Создание...' : 'Создать торт'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateCake;
