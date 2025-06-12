<?php

namespace App\Repositories;

use App\Models\CookingStep;
use App\Models\Responses\CookingStepResponse;
use App\Models\TechnologicalMap;
use App\Models\TechnologicalMapCookingStepsRelation;
use Illuminate\Support\Facades\DB;

class CookingStepsRepository
{
    public function create(array $attributes, int $technologicalMapId): ?CookingStepResponse
    {
        /** @var CookingStep|null $cookingStep */
        $cookingStep = null;
        DB::transaction(function () use (&$cookingStep, $attributes, $technologicalMapId) {
            /** @var CookingStep $cookingStep */
            $cookingStep = CookingStep::query()->create($attributes);

            TechnologicalMapCookingStepsRelation::query()->create(
                [
                    'id_technological_map' => $technologicalMapId,
                    'id_cooking_step' => $cookingStep->id,
                ]
            );

            $technologicalMapRepo = new TechnologicalMapsRepository();
            $technologicalMapRepo->updateCookingTime($technologicalMapId);
        });

        if (is_null($cookingStep)) {
            return null;
        }

        return $cookingStep->toResponse();
    }

    /**
     * @return CookingStepResponse[]
     */
    public function all(): array
    {
        $result = [];
        $cookingSteps = CookingStep::query()->get();
        /** @var CookingStep $cookingStep */
        foreach ($cookingSteps as $cookingStep) {
            $response = $cookingStep->toResponse();
            $result[] = $response;
        }

        return $result;
    }

    public function getById(int $id): CookingStepResponse
    {
        /** @var CookingStep $cookingStep */
        $cookingStep = CookingStep::query()->find($id);
        return $cookingStep->toResponse();
    }

    public function updateById(int $id, array $attributes): CookingStepResponse
    {
        /** @var CookingStep $cookingStep */
        $cookingStep = CookingStep::query()->find($id);
        $cookingStep->update($attributes);
        return $this->getById($id);
    }

    public function deleteById(int $id): bool
    {
        $isSuccess = false;
        DB::transaction(function () use ($id, &$isSuccess) {
            /** @var CookingStep $cookingStep */
            $cookingStep = CookingStep::query()->find($id);

            /** @var TechnologicalMap $technologicalMap */
            $technologicalMap = $cookingStep->technologicalMap()->first();
            $cookingStep->delete();

            $technologicalMapRepo = new TechnologicalMapsRepository();
            $technologicalMapRepo->updateCookingTime($technologicalMap->id);
            $isSuccess = true;
        });

        return $isSuccess;
    }
}
