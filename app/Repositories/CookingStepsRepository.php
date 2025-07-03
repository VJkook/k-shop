<?php

namespace App\Repositories;

use App\Models\BasicIntervalTime;
use App\Models\CookingStep;
use App\Models\Responses\CookingStepResponse;
use App\Models\TechnologicalMap;
use App\Models\TechnologicalMapCookingStepsRelation;
use Illuminate\Support\Facades\DB;

class CookingStepsRepository
{
    public function create(array $attributes, int $technologicalMapId, BasicIntervalTime $stepTime): ?CookingStepResponse
    {
        /** @var CookingStep|null $cookingStep */
        $cookingStep = null;
        DB::transaction(function () use ($stepTime, &$cookingStep, $attributes, $technologicalMapId) {
            $attributes['step_time'] = $stepTime;
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

        return $this->getById($cookingStep->id);
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

    public function byMapId(int $mapId): array
    {
        $result = [];

        /** @var TechnologicalMap $technologicalMap */
        $technologicalMap = TechnologicalMap::query()->find($mapId);
        $cookingSteps = $technologicalMap->steps()->orderBy('step_number')->get();
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
        DB::transaction(function () use ($id, $attributes) {
            /** @var CookingStep $cookingStep */
            $cookingStep = CookingStep::query()->find($id);
            $cookingStep->update($attributes);

            /** @var TechnologicalMap $technologicalMap */
            $technologicalMap = $cookingStep->technologicalMap()->first();
            $technologicalMapRepo = new TechnologicalMapsRepository();
            $technologicalMapRepo->updateCookingTime($technologicalMap->id);
        });

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
