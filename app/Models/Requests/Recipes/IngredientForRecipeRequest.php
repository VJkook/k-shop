<?php

namespace App\Models\Requests\Recipes;

class IngredientForRecipeRequest
{
    public function __construct(
        public int $ingredientId,
        public float $quantity,
    )
    {
    }
}
