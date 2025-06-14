<?php

namespace App\Models\Responses\Recipes;

use App\Models\Recipe;

class RecipeReadyCakeResponse
{
    public function __construct(
        public int         $id,
        public string      $name,
        public string|null $description,
        public int         $id_ready_cake,
        public int|null    $id_technological_map,
    )
    {
    }

    public static function fromModel(Recipe $recipe): self
    {
        return new RecipeReadyCakeResponse(
            $recipe->id,
            $recipe->name,
            $recipe->description,
            $recipe->id_ready_cake,
            $recipe->id_technological_map,
        );
    }
}
