import React, { FC, useState, useMemo } from 'react';
import styles from "./OrderTable.module.scss";

interface Ingredient {
    name: string;
    amount: string;
}

interface Step {
    id: number;
    description: string;
    imageUrl?: string;
}

const ingredients: Ingredient[] = [
    { name: "Мука пшеничная", amount: "300.0 г" },
    { name: "Сахар", amount: "200.0 г" },
    { name: "Какао порошок", amount: "50.0 г" },
    { name: "Яйца", amount: "3.0 шт" },
    { name: "Масло сливочное", amount: "150.0 г" },
];

const steps: Step[] = [
    { id: 1, description: "Разогрейте духовку до 180°С", imageUrl: 'D:/img/день рождения/t.jpg' },
    { id: 2, description: "Смешайте муку с какао-порошком" },
    { id: 3, description: "Взбейте яйца с сахаром до пышности" },
    { id: 4, description: "Растопите сливочное масло" },
];

const Recipe: FC = () => {
    return (
        <div className={styles.page}>
            <div className={styles.container}>


                <div className={styles.card}>
                    <div className={styles["card-header"]}>
                        <div className={styles["recipe-title"]}>
                            <i className="fas fa-utensils"></i> Шоколадный торт
                            <span className={styles.quantity}>1 шт.</span>
                        </div>
                        <a href="#" className={styles["recipe-link"]}>
                            <i className="fas fa-external-link-alt"></i> Рдактировать рецепт
                        </a>
                    </div>

                    <p className={styles.description}>Классический шоколадный торт с кремом</p>

                    <div className={styles["ingredients-section"]}>
                        <h2 className={styles["section-title"]}>
                            <i className="fas fa-shopping-cart"></i> Ингредиенты:
                        </h2>
                        <div className={styles["ingredients-list"]}>
                            {ingredients.map(({ name, amount }) => (
                                <div className={styles.ingredient} key={name}>
                                    <span>{name}</span>
                                    <span className={styles.amount}>{amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles["steps-section"]}>
                        <h2 className={styles["section-title"]}>
                            <i className="fas fa-list-ol"></i> Пошаговая инструкция:
                        </h2>
                        <ol className={styles["steps-list"]}>
                            {steps.map(({ id, description, imageUrl  }) => (
                                <li className={styles.stepItem} key={id}>
                                    <div className={styles["stepNumber"]}>{id}</div>

                                    <div className={styles.stepContent}>
                                        {imageUrl && (
                                            <img
                                                src={imageUrl}
                                                alt={`Шаг ${id}`}
                                                className={styles.stepImage}
                                            />
                                        )}
                                        <span>{description}</span>

                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Recipe
