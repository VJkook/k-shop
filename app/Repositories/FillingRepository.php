<?php

namespace App\Repositories;

use App\Models\Filling;
use App\Models\Image;
use App\Models\Responses\FillingResponse;
use App\Models\Responses\ImageResponse;

class FillingRepository
{
    public function create(array $attributes): ?FillingResponse
    {
        /** @var Filling $filling */
        $filling = Filling::query()->create($attributes);
        return $this->buildFillingsResponse($filling);
    }

    /**
     * @return FillingResponse[]
     */
    public function all(): array
    {
        $result = [];
        $fillings = Filling::query()->get();
        /** @var Filling $filling */
        foreach ($fillings as $filling) {
            $fillingResponse = $this->buildFillingsResponse($filling);
            $result[] = $fillingResponse;
        }

        return $result;
    }

    public function getById(int $id): FillingResponse
    {
        /** @var Filling $filling */
        $filling = Filling::query()->find($id);
        return $this->buildFillingsResponse($filling);
    }

    public function updateById(int $id, array $attributes): FillingResponse
    {
        /** @var Filling $filling */
        $filling = Filling::query()->find($id);
        $filling->update($attributes);
        return $this->getById($id);
    }

    public function deleteById(int $id): bool
    {
        return Filling::query()->find($id)->delete();
    }

    private function buildFillingsResponse(Filling $filling): FillingResponse
    {
        $fillingResponse = new FillingResponse(
            $filling->id,
            $filling->name,
            $filling->description,
            $filling->price_by_kg,
        );

        /** @var Image $image */
        $image = $filling->image()->first();
        if (!is_null($image)) {
            $fillingResponse->setImage(new ImageResponse($image->id, $image->getUrl()));
        }

        return $fillingResponse;
    }
}
