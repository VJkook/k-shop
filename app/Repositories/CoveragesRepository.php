<?php

namespace App\Repositories;

use App\Models\Coverage;
use App\Models\Image;
use App\Models\Responses\CoverageResponse;
use App\Models\Responses\ImageResponse;

class CoveragesRepository
{
    public function create(array $attributes): ?CoverageResponse
    {
        /** @var Coverage $coverage */
        $coverage = Coverage::query()->create($attributes);
        return $this->buildCoverageResponse($coverage);
    }

    /**
     * @return CoverageResponse[]
     */
    public function all(): array
    {
        $result = [];
        $coverages = Coverage::query()->get();
        /** @var Coverage $filling */
        foreach ($coverages as $coverage) {
            $fillingResponse = $this->buildCoverageResponse($coverage);
            $result[] = $fillingResponse;
        }

        return $result;
    }

    public function getById(int $id): CoverageResponse
    {
        /** @var Coverage $coverage */
        $coverage = Coverage::query()->find($id);
        return $this->buildCoverageResponse($coverage);
    }

    public function updateById(int $id, array $attributes): CoverageResponse
    {
        /** @var Coverage $coverage */
        $coverage = Coverage::query()->find($id);
        $coverage->update($attributes);
        return $this->getById($id);
    }

    public function deleteById(int $id): bool
    {
        return Coverage::query()->find($id)->delete();
    }

    private function buildCoverageResponse(Coverage $coverage): CoverageResponse
    {
        $coverageResponse = new CoverageResponse(
            $coverage->id,
            $coverage->name,
            $coverage->description,
            $coverage->price,
        );

        /** @var Image $image */
        $image = $coverage->image()->first();
        if (!is_null($image)) {
            $coverageResponse->setImage(new ImageResponse($image->id, $image->getUrl()));
        }

        return $coverageResponse;
    }
}
