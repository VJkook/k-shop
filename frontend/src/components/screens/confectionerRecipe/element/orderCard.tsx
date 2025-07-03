import { useState, FC, useEffect } from 'react';
import styles from './OrderTable.module.scss';
import { apiGet } from '@/utils/apiInstance';

interface Recipe {
    id: number;
    name: string;
    description: string;
    id_ready_cake: number | null;
    id_filling: number | null;
    id_decor: number | null;
    technological_map: {
        id: number;
        name: string;
        description: string;
        cooking_time: string;
        cooking_steps: {
            id: number;
            description: string;
            step_number: number;
            step_time: string;
            image: {
                id: number;
                url: string;
            } | null;
        }[];
    } | null;
    ingredients: {
        id: number;
        name: string;
        measurement: string;
        quantity: number;
    }[];
}

const RecipeList: FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Загрузка рецептов из API
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await apiGet('/api/recipes');

                if (!response.data) {
                    throw new Error('Не удалось загрузить рецепты');
                }

                setRecipes(response.data);
            } catch (err) {
                console.error('Ошибка загрузки рецептов:', err);
                setError('Ошибка загрузки данных');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    // Фильтрация рецептов по поисковому запросу
    const filteredRecipes = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Список рецептов</div>
                <div className={styles.counter}>
                    {loading ? 'Загрузка...' :
                        filteredRecipes.length === 0 ? 'Нет рецептов' :
                            `${filteredRecipes.length} ${getRecipeCountText(filteredRecipes.length)}`}
                </div>
            </div>

            <div className={styles.filters}>
                <div className={styles.searchContainer}>
                    <div className={styles.searchInput}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            type="text"
                            placeholder="Поиск по названию рецепта..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Загрузка рецептов...</p>
                </div>
            ) : error ? (
                <div className={styles.errorContainer}>
                    <p className={styles.errorText}>{error}</p>
                    <button
                        className={styles.retryButton}
                        onClick={() => window.location.reload()}
                    >
                        Попробовать снова
                    </button>
                </div>
            ) : (
                <div className={styles.tableResponsive}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название рецепта</th>
                            <th>Тип</th>
                            <th>Описание</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredRecipes.map(recipe => (
                            <tr key={recipe.id}>
                                <td>{recipe.id}</td>
                                <td className={styles.truncate}>{recipe.name}</td>
                                <td className={styles.typeCell}>
                                    {recipe.id_ready_cake && <span className={styles.typeBadge}>Торт</span>}
                                    {recipe.id_filling && <span className={styles.typeBadge}>Начинка</span>}
                                    {recipe.id_decor && <span className={styles.typeBadge}>Декор</span>}
                                </td>
                                <td className={styles.descriptionCell}>
                                    {recipe.description}
                                </td>
                                <td>
                                    <a
                                        href={`/recipe/${recipe.id}`}
                                        className={styles.detailsButton}
                                    >
                                        Перейти
                                    </a>
                                </td>
                            </tr>
                        ))}
                        {filteredRecipes.length === 0 && (
                            <tr>
                                <td colSpan="5">Рецептов не найдено</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// Функция для правильного склонения слова "рецепт"
const getRecipeCountText = (count: number) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return 'рецептов';
    }

    if (lastDigit === 1) {
        return 'рецепт';
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
        return 'рецепта';
    }

    return 'рецептов';
};

export default RecipeList;
