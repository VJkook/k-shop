<?php

namespace App\Models\Responses\Recipes;

use App\Models\Recipe;

class RecipeFillingResponse
{
    public function __construct(
        public int         $id,
        public string      $name,
        public string|null $description,
        public int         $id_filling,
        public int|null    $id_technological_map,
    )
    {
    }

    public static function fromModel(Recipe $recipe): self
    {
        return new RecipeFillingResponse(
            $recipe->id,
            $recipe->name,
            $recipe->description,
            $recipe->id_filling,
            $recipe->id_technological_map,
        );
    }
}
