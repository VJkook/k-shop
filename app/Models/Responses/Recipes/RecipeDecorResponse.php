<?php

namespace App\Models\Responses\Recipes;

use App\Models\Recipe;
use App\Models\Responses\TechnologicalMapResponse;

class RecipeDecorResponse
{
    public function __construct(
        public int                           $id,
        public string                        $name,
        public string|null                   $description,
        public int                           $id_decor,
        public TechnologicalMapResponse|null $technological_map,
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
