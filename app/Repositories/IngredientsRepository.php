<?php

namespace App\Repositories;

use App\Models\Ingredient;
use App\Models\Responses\IngredientResponse;

class IngredientsRepository
{
    public function create(array $attributes): ?IngredientResponse
    {
        /** @var Ingredient $ingredient */
        $ingredient = Ingredient::query()->create($attributes);
        return $ingredient->toResponse();
    }

    /**
     * @return IngredientResponse[]
     */
    public function all(): array
    {
        $result = [];
        $ingredients = Ingredient::query()->get();
        /** @var Ingredient $ingredient */
        foreach ($ingredients as $ingredient) {
            $response = $ingredient->toResponse();
            $result[] = $response;
        }

        return $result;
    }

    public function getById(int $id): IngredientResponse
    {
        /** @var Ingredient $ingredient */
        $ingredient = Ingredient::query()->find($id);
        return $ingredient->toResponse();
    }

    public function updateById(int $id, array $attributes): IngredientResponse
    {
        /** @var Ingredient $ingredient */
        $ingredient = Ingredient::query()->find($id);
        $ingredient->update($attributes);
        return $this->getById($id);
    }

    public function deleteById(int $id): bool
    {
        return Ingredient::query()->find($id)->delete();
    }
}
