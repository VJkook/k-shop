<?php

namespace App\Repositories;

use App\Models\Decor;
use App\Models\Image;
use App\Models\Responses\DecorResponse;
use App\Models\Responses\ImageResponse;

class DecorsRepository
{
    public function create(array $attributes): ?DecorResponse
    {
        /** @var Decor $coverage */
        $coverage = Decor::query()->create($attributes);
        return $this->buildResponse($coverage);
    }

    /**
     * @return DecorResponse[]
     */
    public function all(): array
    {
        $result = [];
        $coverages = Decor::query()->get();
        /** @var Decor $filling */
        foreach ($coverages as $coverage) {
            $fillingResponse = $this->buildResponse($coverage);
            $result[] = $fillingResponse;
        }

        return $result;
    }

    public function getById(int $id): DecorResponse
    {
        /** @var Decor $decor */
        $decor = Decor::query()->find($id);
        return $this->buildResponse($decor);
    }

    public function updateById(int $id, array $attributes): DecorResponse
    {
        /** @var Decor $decor */
        $decor = Decor::query()->find($id);
        $decor->update($attributes);
        return $this->getById($id);
    }

    public function deleteById(int $id): bool
    {
        return Decor::query()->find($id)->delete();
    }

    private function buildResponse(Decor $coverage): DecorResponse
    {
        $response = new DecorResponse(
            $coverage->id,
            $coverage->name,
            $coverage->description,
            $coverage->price,
        );

        /** @var Image $image */
        $image = $coverage->image()->first();
        if (!is_null($image)) {
            $response->setImage(new ImageResponse($image->id, $image->getUrl()));
        }

        return $response;
    }
}
