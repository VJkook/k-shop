<?php

namespace App\Models\Responses\Recipes;

use App\Models\Responses\TechnologicalMapResponse;

class RecipeReadyCakeResponse
{
    /**
     * @param int $id
     * @param string $name
     * @param string|null $description
     * @param int $id_ready_cake
     * @param TechnologicalMapResponse|null $technological_map
     * @param IngredientRecipeResponse[] $ingredients
     */
    public function __construct(
        public int                           $id,
        public string                        $name,
        public string|null                   $description,
        public int                           $id_ready_cake,
        public TechnologicalMapResponse|null $technological_map = null,
        public array                         $ingredients = [],
    )
    {
    }
}
