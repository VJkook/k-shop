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
        /** @var Decor $decor */
        $decor = Decor::query()->create($attributes);
        return $this->buildResponse($decor);
    }

    /**
     * @return DecorResponse[]
     */
    public function all(): array
    {
        $result = [];
        $decors = Decor::query()->get();
        /** @var Decor $decor */
        foreach ($decors as $decor) {
            $response = $this->buildResponse($decor);
            $result[] = $response;
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

    private function buildResponse(Decor $decor): DecorResponse
    {
        $response = new DecorResponse(
            $decor->id,
            $decor->name,
            $decor->description,
            $decor->price,
        );

        /** @var Image $image */
        $image = $decor->image()->first();
        if (!is_null($image)) {
            $response->setImage(new ImageResponse($image->id, $image->getUrl()));
        }

        return $response;
    }
}
