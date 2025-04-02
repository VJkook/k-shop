<?php

namespace App\Repositories;

use App\Models\Image;
use App\Models\Product;
use App\Models\Responses\ImageResponse;
use App\Models\Responses\ProductResponse;

class ProductRepository
{
    public function createProduct(array $attributes): ProductResponse
    {
        $product = Product::query()->create($attributes);
        /** @var Product $product */
        $product = Product::query()->with('images')->find($product->id);
        $productResponse = new ProductResponse(
            $product->id,
            $product->name,
            $product->description,
            $product->composition,
            $product->weight,
            $product->price,
        );

        return $productResponse;
    }

    /**
     * @return ProductResponse[]
     */
    public function products(): array
    {
        $result = [];
        $products = Product::query()->with('images')->get();
        /** @var Product $product */
        foreach ($products as $product) {
            $productResponse = new ProductResponse(
                $product->id,
                $product->name,
                $product->description,
                $product->composition,
                $product->weight,
                $product->price,
            );

            $images = [];
            /** @var Image $image */
            foreach ($product->images as $image) {
                $images[] = new ImageResponse(
                    $image->id,
                    Image::PATH . $image->id
                );
            }

            $productResponse->setImages($images);
            $result[] = $productResponse;
        }

        return $result;
    }

    public function getProductById(int $id): ProductResponse
    {
        /** @var Product $product */
        $product = Product::query()->with('images')->find($id);
        $productResponse = new ProductResponse(
            $product->id,
            $product->name,
            $product->description,
            $product->composition,
            $product->weight,
            $product->price,
        );

        $images = [];
        /** @var Image $image */
        foreach ($product->images as $image) {
            $images[] = new ImageResponse(
                $image->id,
                Image::PATH . $image->id
            );
        }

        $productResponse->setImages($images);
        return $productResponse;
    }
}
