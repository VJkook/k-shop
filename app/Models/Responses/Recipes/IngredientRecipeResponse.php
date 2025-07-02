<?php

namespace App\Models\Responses\Recipes;

class IngredientRecipeResponse
{
    public function __construct(
        public int    $id,
        public string $name,
        public string $measurement,
        public float  $quantity,
    )
    {
    }
}
