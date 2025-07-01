import React, { FC, useState, useMemo } from 'react';
import Link from 'next/link';
import styles from './OrderTable.module.scss';



interface Ingredient {
    name: string;
    amount: string;
    unit: string;

}
interface Step {
    text: string;
    time?: string;
    image?: string; // поле для картинки шага
}

const Recipe: FC = () => {
    const [recipeName, setRecipeName] = useState('Эклеры с шоколадом');
    const [description, setDescription] = useState('Вкусные французские эклеры с нежным шоколадным кремом и глазурью.');
    const [ingredients, setIngredients] = useState<Ingredient[]>([
        { name: 'Мука', amount: '100', unit: 'Грамм' },
        { name: 'Молоко', amount: '250', unit: 'Мл' },
        { name: 'Яйца', amount: '3', unit: 'Штуки' },
        { name: 'Сливочное масло', amount: '80', unit: 'Грамм' },
        { name: 'Сахар', amount: '50', unit: 'Грамм' }
    ]);

    const [steps, setSteps] = useState<string[]>([
        'Подготовить ингредиенты.',
        'Сварить тесто и остудить его.',
        'Добавить яйца и тщательно перемешать.',
        'Выпекать эклеры в духовке.',
        'Приготовить крем и заполнить эклеры.'
    ]);

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: '', amount: '', unit: 'Грамм' }]);
    };

    const handleRemoveIngredient = (index: number) => {
        const updated = [...ingredients];
        updated.splice(index, 1);
        setIngredients(updated);
    };

    const handleIngredientChange = (index: number, key: keyof Ingredient, value: string) => {
        const updated = [...ingredients];
        updated[index][key] = value;
        setIngredients(updated);
    };

    const handleAddStep = () => {
        setSteps([...steps, '']);
    };

    const handleRemoveStep = (index: number) => {
        const updated = [...steps];
        updated.splice(index, 1);
        setSteps(updated);
    };

    const handleStepChange = (index: number, value: string) => {
        const updated = [...steps];
        updated[index] = value;
        setSteps(updated);
    };


    const [images, setImages] = useState<string[]>([]);
    const [preview, setPreview] = useState<string | null>(null);
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

    const handleStepTimeChange = (index: number, value: string) => {
        const updated = [...steps];
        updated[index] = { ...updated[index], time: value };
        setSteps(updated);
    };

    return (
        <div className={styles.recipeForm}>
            <div className={styles.recipeForm__container}>
                <h1 className={styles.recipeForm__title}>
                   Создание рецепта
                </h1>

                <section className={styles.recipeForm__section}>
                    <h2 className={styles.recipeForm__sectionTitle}>
                       Основная информация
                    </h2>
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
                            />
                        </div>
                    </div>
                </section>

                <section className={styles.recipeForm__section}>
                    <div className={styles.recipeForm__sectionHeader}>
                        <h2 className={styles.recipeForm__sectionTitle}>
                             Ингредиенты
                        </h2>
                        <button
                            type="button"
                            onClick={handleAddIngredient}
                            className={styles.recipeForm__buttonAdd}
                        >
                           Добавить ингредиент
                        </button>
                    </div>

                    <div className={styles.recipeForm__list}>
                        {ingredients.map((ingredient, index) => (
                            <div key={index} className={styles.ingredientRow}>
                                <input
                                    type="text"
                                    placeholder="Название ингредиента"
                                    className={styles.ingredientName}
                                    value={ingredient.name}
                                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Количество"
                                    className={styles.ingredientWeight}
                                    value={ingredient.amount}
                                    onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                                />
                                <select
                                    className={styles.ingredientMeasure}
                                    value={ingredient.unit}
                                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                >
                                    <option>Грамм</option>
                                    <option>Мл</option>
                                    <option>Штуки</option>
                                </select>
                                <button
                                    type="button"
                                    className={styles.recipeForm__buttonRemove}
                                    onClick={() => handleRemoveIngredient(index)}
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
                        >
                            Добавить шаг
                        </button>
                    </div>
                    <div className={styles.recipeForm__list}>
                        {steps.map((step, index) => (
                            <div key={index} className={styles.recipeForm__stepRow}>
  <textarea
      rows={2}
      placeholder={`Шаг ${index + 1}`}
      className={styles.recipeForm__textarea}

      onChange={(e) => handleStepChange(index, e.target.value)}
  />
                                <div className={styles.widgt}>
                                <textarea
                                    placeholder={`время\nмин`}
                                    className={styles.timeInput}
                                    rows={2}
                                    value={step.time || ''}
                                    onChange={(e) => handleStepTimeChange(index, e.target.value)}
                                />
                                </div>
                                <div className={styles.image_wrapper}>
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Предпросмотр"
                                            className={styles.img}
                                        />
                                    ) : (
                                        <label className={styles.upload_area}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className={styles.upload_input}
                                            />
                                            📷
                                        </label>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    className={styles.recipeForm__buttonRemove}
                                    onClick={() => handleRemoveStep(index)}
                                >
x
                                </button>
                            </div>
                        ))}

                    </div>
                </section>
                <button
                    type="submit"
                    className={styles.recipeForm__buttonCreate}
                >
                    Создать рецепт
                </button>
            </div>
        </div>
    );
}

export default Recipe

