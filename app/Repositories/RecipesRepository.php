<?php

namespace App\Repositories;

use App\Models\Recipe;
use App\Models\Responses\Recipes\RecipeDecorResponse;
use App\Models\Responses\Recipes\RecipeFillingResponse;
use App\Models\Responses\Recipes\RecipeReadyCakeResponse;

class RecipesRepository
{
    public function createForReadyCake(string $name, ?string $description, int $id_ready_cake): ?RecipeReadyCakeResponse
    {
        $attributes = [
            'name' => $name,
            'description' => $description,
            'id_ready_cake' => $id_ready_cake,
        ];

        /** @var Recipe $recipe */
        $recipe = Recipe::query()->create($attributes);

        return $recipe->toRecipeReadyCakeResponse();
    }

    public function createForDecor(string $name, ?string $description, int $id_decor): ?RecipeDecorResponse
    {
        $attributes = [
            'name' => $name,
            'description' => $description,
            'id_decor' => $id_decor,
        ];

        /** @var Recipe $recipe */
        $recipe = Recipe::query()->create($attributes);

        return $recipe->toRecipeDecorResponse();
    }

    public function createForFilling(string $name, ?string $description, int $id_filling): ?RecipeFillingResponse
    {
        $attributes = [
            'name' => $name,
            'description' => $description,
            'id_filling' => $id_filling,
        ];

        /** @var Recipe $recipe */
        $recipe = Recipe::query()->create($attributes);

        return $recipe->toRecipeFillingResponse();
    }

    public function addTechnologicalMap(
        int $id_recipe,
        int $id_technological_map
    ): null|RecipeFillingResponse|RecipeDecorResponse|RecipeReadyCakeResponse
    {
        /** @var Recipe $recipe */
        $recipe = Recipe::query()->find($id_recipe);
        $recipe->id_technological_map = $id_technological_map;
        $recipe->save();

        if (!is_null($recipe->id_ready_cake)) {
            return $recipe->toRecipeReadyCakeResponse();
        }

        if (!is_null($recipe->id_decor)) {
            return $recipe->toRecipeDecorResponse();
        }

        if (!is_null($recipe->id_filling)) {
            return $recipe->toRecipeFillingResponse();
        }

        return null;
    }

    /**
     * @return RecipeFillingResponse[]|RecipeDecorResponse[]|RecipeReadyCakeResponse[]
     */
    public function all(): array
    {
        $result = [];
        $recipes = Recipe::query()->get();
        /** @var Recipe $recipe */
        foreach ($recipes as $recipe) {
            $recipeResponse = $this->buildResponse($recipe);
            $result[] = $recipeResponse;
        }

        return $result;
    }

    public function getById(int $id): null|RecipeFillingResponse|RecipeDecorResponse|RecipeReadyCakeResponse
    {
        /** @var Recipe $recipe */
        $recipe = Recipe::query()->find($id);
        return $this->buildResponse($recipe);
    }

    public function updateById(int $id, array $attributes): null|RecipeFillingResponse|RecipeDecorResponse|RecipeReadyCakeResponse
    {
        /** @var Recipe $recipe */
        $recipe = Recipe::query()->find($id);
        $recipe->update($attributes);
        return $this->getById($id);
    }

    public function deleteById(int $id): bool
    {
        return Recipe::query()->find($id)->delete();
    }

    private function buildResponse(Recipe $recipe): null|RecipeFillingResponse|RecipeDecorResponse|RecipeReadyCakeResponse
    {
        if (!is_null($recipe->id_ready_cake)) {
            return $recipe->toRecipeReadyCakeResponse();
        }

        if (!is_null($recipe->id_decor)) {
            return $recipe->toRecipeDecorResponse();
        }

        if (!is_null($recipe->id_filling)) {
            return $recipe->toRecipeFillingResponse();
        }

        return null;
    }
}
