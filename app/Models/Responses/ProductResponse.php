<?php

namespace App\Models\Responses;

use App\Models\Product;

class ProductResponse
{
    /**
     * @param int $id
     * @param string $name
     * @param string|null $description
     * @param string|null $composition
     * @param float|null $weight
     * @param float $price
     * @param ImageResponse[] $images
     */
    public function __construct(
        public int         $id,
        public string      $name,
        public string|null $description,
        public string|null $composition,
        public float|null  $weight,
        public float       $price,
        public array       $images = [],
    )
    {
    }

    /**
     * @param ImageResponse[] $images
     * @return void
     */
    public function setImages(array $images): void
    {
        $this->images = $images;
    }

    public static function fromProduct(Product $product): self
    {
        return new ProductResponse(
            $product->id,
            $product->name,
            $product->description,
            $product->composition,
            $product->weight,
            $product->price,
        );
    }
}
