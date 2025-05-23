<?php

namespace App\Repositories;

use App\Models\Image;
use App\Models\Product;
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
            /** @var ReadyCake $readyCake */
            $readyCake = ReadyCake::query()->create($attributes);

            $productRepo = new ProductRepository();
            $productRepo->create($readyCake->id);

            /** @var ReadyCake $readyCake */
            $readyCake = ReadyCake::query()->find($readyCake->id);

            Product::query()->create(['id_ready_cake' => $readyCake->id]);
        });

        if (is_null($readyCake)) {
            return null;
        }

        return $this->buildReadyCakeResponse($readyCake);
    }

    /**
     * @return ReadyCakeResponse[]
     */
    public function all(): array
    {
        $result = [];
        $products = ReadyCake::query()->get();
        /** @var ReadyCake $readyCake */
        foreach ($products as $readyCake) {
            $productResponse = $this->buildReadyCakeResponse($readyCake);
            $result[] = $productResponse;
        }

        return $result;
    }

    public function getById(int $id): ?ReadyCakeResponse
    {
        /** @var ReadyCake $readyCake */
        $readyCake = ReadyCake::query()->find($id);
        if (is_null($readyCake)) {
            return null;
        }

        return $this->buildReadyCakeResponse($readyCake);
    }

    private function buildReadyCakeResponse(ReadyCake $readyCake): ReadyCakeResponse
    {
        /** @var Product $product */
        $product = $readyCake->product()->first();
        $readyCakeResponse = new ReadyCakeResponse(
            $readyCake->id,
            $readyCake->name,
            $readyCake->description,
            $readyCake->composition,
            $readyCake->weight,
            $readyCake->price,
            $product->id
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

        $readyCakeResponse->setImages($imagesResponses);
        return $readyCakeResponse;
    }
}
