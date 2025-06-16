<?php

namespace App\Repositories;

use App\Models\BasicIntervalTime;
use App\Models\Recipe;
use App\Models\Responses\Recipes\RecipeDecorResponse;
use App\Models\Responses\Recipes\RecipeFillingResponse;
use App\Models\Responses\Recipes\RecipeReadyCakeResponse;
use App\Models\TechnologicalMap;
use Exception;

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
    ): RecipeFillingResponse|RecipeDecorResponse|RecipeReadyCakeResponse
    {
        /** @var Recipe $recipe */
        $recipe = Recipe::query()->find($id_recipe);
        $recipe->id_technological_map = $id_technological_map;
        $recipe->save();

        return $recipe->toResponse();
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
            $result[] = $recipe->toResponse();
        }

        return $result;
    }

    public function getById(int $id): null|RecipeFillingResponse|RecipeDecorResponse|RecipeReadyCakeResponse
    {
        /** @var Recipe $recipe */
        $recipe = Recipe::query()->find($id);
        if (is_null($recipe)) {
            return null;
        }

        return $recipe->toResponse();
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

    /**
     * @throws Exception
     */
    public function getCookingTimeReadyCakeId(int $id): ?BasicIntervalTime
    {
        /** @var Recipe $recipe */
        $recipe = Recipe::query()->where('id_ready_cake', '=', $id)->first();

        if (is_null($recipe)) {
            return null;
        }

        /** @var TechnologicalMap $technologicalMap */
        $technologicalMap = $recipe->technologicalMap()->first();
        if (is_null($technologicalMap)) {
            return null;
        }

        return BasicIntervalTime::fromIntervalString($technologicalMap->cooking_time);
    }

    public function getCookingTimeById(int $id): ?BasicIntervalTime
    {
        /** @var Recipe $recipe */
        $recipe = Recipe::query()->find($id);

        if (is_null($recipe)) {
            return null;
        }

        /** @var TechnologicalMap $technologicalMap */
        $technologicalMap = $recipe->technologicalMap()->first();
        if (is_null($technologicalMap)) {
            return null;
        }

        return BasicIntervalTime::fromIntervalString($technologicalMap->cooking_time);
    }
}
