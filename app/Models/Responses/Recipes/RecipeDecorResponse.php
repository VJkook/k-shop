<?php

namespace App\Models\Responses\Recipes;

use App\Models\Recipe;

class RecipeDecorResponse
{
    public function __construct(
        public int         $id,
        public string      $name,
        public string|null $description,
        public int         $id_decor,
        public int|null    $id_technological_map,
    )
    {
    }

    public static function fromModel(Recipe $recipe): self
    {
        return new RecipeDecorResponse(
            $recipe->id,
            $recipe->name,
            $recipe->description,
            $recipe->id_decor,
            $recipe->id_technological_map,
        );
    }
}
