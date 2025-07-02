<?php

namespace App\Models\Responses\Recipes;

use App\Models\Recipe;
use App\Models\Responses\TechnologicalMapResponse;

class RecipeDecorResponse
{
    /**
     * @param int $id
     * @param string $name
     * @param string|null $description
     * @param int $id_decor
     * @param TechnologicalMapResponse|null $technological_map
     * @param IngredientRecipeResponse[] $ingredients
     */
    public function __construct(
        public int                           $id,
        public string                        $name,
        public string|null                   $description,
        public int                           $id_decor,
        public TechnologicalMapResponse|null $technological_map = null,
        public array                         $ingredients = [],
    )
    {
    }
}
