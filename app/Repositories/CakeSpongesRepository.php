<?php

namespace App\Repositories;

use App\Models\CakeSponge;
use App\Models\Image;
use App\Models\Responses\CakeSpongeResponse;
use App\Models\Responses\ImageResponse;

class CakeSpongesRepository
{
    public function create(array $attributes): ?CakeSpongeResponse
    {
        /** @var CakeSponge $filling */
        $filling = CakeSponge::query()->create($attributes);
        return $this->buildCakeSpongeResponse($filling);
    }

    /**
     * @return CakeSpongeResponse[]
     */
    public function all(): array
    {
        $result = [];
        $fillings = CakeSponge::query()->get();
        /** @var CakeSponge $filling */
        foreach ($fillings as $filling) {
            $fillingResponse = $this->buildCakeSpongeResponse($filling);
            $result[] = $fillingResponse;
        }

        return $result;
    }

    public function getById(int $id): CakeSpongeResponse
    {
        /** @var CakeSponge $filling */
        $filling = CakeSponge::query()->find($id);
        return $this->buildCakeSpongeResponse($filling);
    }

    public function updateById(int $id, array $attributes): CakeSpongeResponse
    {
        /** @var CakeSponge $filling */
        $filling = CakeSponge::query()->find($id);
        $filling->update($attributes);
        return $this->getById($id);
    }

    public function deleteById(int $id): bool
    {
        return CakeSponge::query()->find($id)->delete();
    }

    private function buildCakeSpongeResponse(CakeSponge $cakeSponge): CakeSpongeResponse
    {
        $cakeSpongeResponse = new CakeSpongeResponse(
            $cakeSponge->id,
            $cakeSponge->name,
            $cakeSponge->description,
            $cakeSponge->price,
        );

        /** @var Image $image */
        $image = $cakeSponge->image()->first();
        if (!is_null($image)) {
            $cakeSpongeResponse->setImage(new ImageResponse($image->id, $image->getUrl()));
        }

        return $cakeSpongeResponse;
    }
}
