<?php

namespace App\Repositories;

use App\Models\BasicIntervalTime;
use App\Models\Filling;
use App\Models\Responses\TechnologicalMapResponse;
use App\Models\TechnologicalMap;
use Carbon\Carbon;

class TechnologicalMapsRepository
{
    public function create(array $attributes): ?TechnologicalMapResponse
    {
        /** @var TechnologicalMap $technologicalMap */
        $technologicalMap = TechnologicalMap::query()->create($attributes);
        return $technologicalMap->toResponse();
    }

    /**
     * @return TechnologicalMapResponse[]
     */
    public function all(): array
    {
        $result = [];
        $technologicalMaps = TechnologicalMap::query()->get();
        /** @var TechnologicalMap $technologicalMap */
        foreach ($technologicalMaps as $technologicalMap) {
            $response = $technologicalMap->toResponse();
            $result[] = $response;
        }

        return $result;
    }

    public function getById(int $id): TechnologicalMapResponse
    {
        /** @var TechnologicalMap $technologicalMap */
        $technologicalMap = TechnologicalMap::query()->find($id);
        $this->updateCookingTime($id);
        return $technologicalMap->toResponse();
    }

    public function updateById(int $id, array $attributes): TechnologicalMapResponse
    {
        /** @var TechnologicalMap $technologicalMap */
        $technologicalMap = TechnologicalMap::query()->find($id);
        $technologicalMap->update($attributes);
        return $this->getById($id);
    }

    public function deleteById(int $id): bool
    {
        return Filling::query()->find($id)->delete();
    }

    public function updateCookingTime(int $id): bool
    {
        /** @var TechnologicalMap $technologicalMap */
        $technologicalMap = TechnologicalMap::query()->find($id);
        $stepsQuery = $technologicalMap->steps();

        $cookingTime = null;
        if ($stepsQuery->count() > 0) {
            $cookingTime = BasicIntervalTime::fromIntervalString($technologicalMap->steps()->sum('step_time'));
        }

        $technologicalMap->cooking_time = $cookingTime;
        return $technologicalMap->save();
    }
}
