<?php

namespace App\Models\Responses\Recipes;

use App\Models\Responses\TechnologicalMapResponse;

class RecipeReadyCakeResponse
{
    public function __construct(
        public int                           $id,
        public string                        $name,
        public string|null                   $description,
        public int                           $id_ready_cake,
        public TechnologicalMapResponse|null $technological_map,
    )
    {
    }
}
