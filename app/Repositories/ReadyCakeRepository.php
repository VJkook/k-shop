<?php

namespace App\Repositories;

use App\Models\Image;
use App\Models\ReadyCake;
use App\Models\Responses\ImageResponse;
use App\Models\Responses\ReadyCakeResponse;
use Illuminate\Support\Facades\DB;

class ReadyCakeRepository
{
    public function create(array $attributes): ?ReadyCakeResponse
    {
        $readyCake = null;
        Db::transaction(function () use ($attributes, &$readyCake) {
            $productRepo = new ProductRepository();
            $product = $productRepo->create();

            $attributes['id_product'] = $product->id;
            $readyCake = ReadyCake::query()->create($attributes);
            /** @var ReadyCake $readyCake */
            $readyCake = ReadyCake::query()->with('images')->find($readyCake->id);
        });

        if (is_null($readyCake)) {
            return null;
        }

        $readyCakeResponse = $this->buildReadyCakeResponse($readyCake);
        return $readyCakeResponse;
    }

    /**
     * @return ReadyCakeResponse[]
     */
    public function all(): array
    {
        $result = [];
        $products = ReadyCake::query()->with('images')->get();
        /** @var ReadyCake $readyCake */
        foreach ($products as $readyCake) {
            $productResponse = $this->buildReadyCakeResponse($readyCake);
            $result[] = $productResponse;
        }

        return $result;
    }

    public function getById(int $id): ReadyCakeResponse
    {
        /** @var ReadyCake $readyCake */
        $readyCake = ReadyCake::query()->with('images')->find($id);
        $productResponse = $this->buildReadyCakeResponse($readyCake);
        return $productResponse;
    }

    private function buildReadyCakeResponse(ReadyCake $readyCake): ReadyCakeResponse
    {
        $productResponse = new ReadyCakeResponse(
            $readyCake->id,
            $readyCake->name,
            $readyCake->description,
            $readyCake->composition,
            $readyCake->weight,
            $readyCake->price,
            $readyCake->id_product
        );

        $images = $readyCake->images()->get();
        $imagesResponses = [];
        /** @var Image $image */
        foreach ($images as $image) {
            $imagesResponses[] = new ImageResponse(
                $image->id,
                $image->getUrl()
            );
        }

        $productResponse->setImages($imagesResponses);
        return $productResponse;
    }
}
