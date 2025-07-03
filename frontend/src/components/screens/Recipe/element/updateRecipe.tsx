import React, { FC, useState, useEffect } from 'react';
import styles from "./OrderTable.module.scss";
import { apiGet } from '@/utils/apiInstance'; // Импортируем apiGet

interface RecipeIngredient {
    id: number;
    name: string;
    measurement: string;
    quantity: number;
}

interface RecipeStep {
    id: number;
    description: string;
    step_number: number;
    step_time: string;
    image?: {
        id: number;
        url: string;
    };
}

interface TechnologicalMap {
    id: number;
    name: string;
    description: string;
    cooking_time: string;
    cooking_steps: RecipeStep[];
}

interface RecipeData {
    id: number;
    name: string;
    description: string;
    id_filling: number | null;
    technological_map: TechnologicalMap;
    ingredients: RecipeIngredient[];
}

interface RecipeProps {
    id: number; // ID рецепта для загрузки
}

const UpdateRecipe: FC<RecipeProps> = ({ id }) => {
    const [recipe, setRecipe] = useState<RecipeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await apiGet(`/api/recipes/${id}`);

                if (!response.data) {
                    throw new Error('Рецепт не найден');
                }

                setRecipe(response.data);
            } catch (err) {
                setError('Ошибка загрузки рецепта');
                console.error('Ошибка:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRecipe();
        }
    }, [id]);

    const openImageModal = (url: string, alt: string) => {
        setSelectedImage({ url, alt });
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    // Закрытие модального окна при клике вне изображения
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeImageModal();
        }
    };

    // Закрытие модального окна при нажатии Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && selectedImage) {
                closeImageModal();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage]);

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.card}>
                        <p>Загрузка рецепта...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.card}>
                        <p className={styles.error}>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.card}>
                        <p>Рецепт не найден</p>
                    </div>
                </div>
            </div>
        );
    }

    // Форматируем ингредиенты для отображения
    const formattedIngredients = recipe.ingredients.map(ingredient => ({
        name: ingredient.name,
        amount: `${ingredient.quantity} ${ingredient.measurement}`
    }));

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles["card-header"]}>
                        <div className={styles["recipe-title"]}>
                            <i className="fas fa-utensils"></i> {recipe.name}
                            {recipe.id_filling && (
                                <span className={styles.fillingBadge}>
                                    Начинка: {recipe.id_filling}
                                </span>
                            )}
                        </div>
                        <a
                            href={`/edit-recipe/${recipe.id}`}
                            className={styles["recipe-link"]}
                        >
                            <i className="fas fa-external-link-alt"></i> Редактировать рецепт
                        </a>
                    </div>

                    <p className={styles.description}>{recipe.description}</p>

                    <div className={styles["ingredients-section"]}>
                        <h2 className={styles["section-title"]}>
                            <i className="fas fa-shopping-cart"></i> Ингредиенты:
                        </h2>
                        <div className={styles["ingredients-list"]}>
                            {formattedIngredients.map(({ name, amount }, index) => (
                                <div className={styles.ingredient} key={`${name}-${index}`}>
                                    <span>{name}</span>
                                    <span className={styles.amount}>{amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {recipe.technological_map && (
                        <div className={styles["steps-section"]}>
                            <h2 className={styles["section-title"]}>
                                <i className="fas fa-list-ol"></i> Пошаговая инструкция:
                                <span className={styles.cookingTime}>
                                    Общее время: {recipe.technological_map.cooking_time}
                                </span>
                            </h2>
                            <ol className={styles["steps-list"]}>
                                {recipe.technological_map.cooking_steps.map(step => (
                                    <li className={styles.stepItem} key={step.id}>
                                        <div className={styles["stepNumber"]}>{step.step_number}</div>
                                        <div className={styles.stepContent}>
                                            {step.image?.url && (
                                                <div
                                                    className={styles.imageWrapper}
                                                    onClick={() => openImageModal(
                                                        step.image!.url,
                                                        `Шаг ${step.step_number}`
                                                    )}
                                                >
                                                    <img
                                                        src={step.image.url}
                                                        alt={`Шаг ${step.step_number}`}
                                                        className={styles.stepImage}
                                                    />
                                                    <div className={styles.zoomHint}>
                                                        <i className="fas fa-search-plus"></i>
                                                    </div>
                                                </div>
                                            )}
                                            <div>
                                                <span>{step.description}</span>
                                                {step.step_time && step.step_time !== "00:00:00" && (
                                                    <div className={styles.stepTime}>
                                                        Время: {step.step_time}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}
                </div>
            </div>

            {/* Модальное окно для увеличенного изображения */}
            {selectedImage && (
                <div
                    className={styles.imageModal}
                    onClick={handleBackdropClick}
                >
                    <div className={styles.modalContent}>
                        <button
                            className={styles.closeButton}
                            onClick={closeImageModal}
                        >
                            &times;
                        </button>
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.alt}
                            className={styles.enlargedImage}
                        />
                        <div className={styles.imageCaption}>{selectedImage.alt}</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UpdateRecipe;
