import { useState, FC } from 'react';
import styles from './OrderTable.module.scss';


interface Recipe {
    id: number;
    name: string;
}
const RecipeList: FC = () => {

    const [recipes, setRecipes] = useState<Recipe[]>([
        { id: 1, name: 'Эклеры с шоколадом' },
        { id: 2, name: 'Блины с творогом' },
        { id: 3, name: 'Шарлотка с яблоками' },

    ]);

    const [searchQuery, setSearchQuery] = useState('');

    const filteredRecipes = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleView = (id: number) => {
        // Переход к детальной информации рецепта
        // Здесь можно использовать router.push(`/recipes/${id}`) при использовании Next.js
        alert(`Переход к рецепту ID: ${id}`);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Список рецептов</div>
                <div className={styles.counter}>{filteredRecipes.length} рецептов</div>
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
                        />
                    </div>
                </div>
            </div>

            <div className={styles.tableResponsive}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название рецепта</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredRecipes.map(recipe => (
                        <tr key={recipe.id}>
                            <td>{recipe.id}</td>
                            <td className={styles.truncate}>{recipe.name}</td>
                            <td>
                                <a href={`/recipes/${recipe.id}`} className={styles.detailsButton}>Перейти</a>
                            </td>
                        </tr>
                    ))}
                    {filteredRecipes.length === 0 && (
                        <tr>
                            <td colSpan="3">Рецептов не найдено</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default RecipeList
