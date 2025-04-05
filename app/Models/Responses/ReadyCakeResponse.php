<?php

namespace App\Models\Responses;

use App\Models\ReadyCake;

class ReadyCakeResponse
{
    /**
     * @param int $id
     * @param string $name
     * @param string|null $description
     * @param string|null $composition
     * @param float|null $weight
     * @param float $price
     * @param int $id_product
     * @param ImageResponse[] $images
     */
    public function __construct(
        public int         $id,
        public string      $name,
        public string|null $description,
        public string|null $composition,
        public float|null  $weight,
        public float       $price,
        public int         $id_product,
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

    public static function fromReadyCake(ReadyCake $readyCake): self
    {
        return new ReadyCakeResponse(
            $readyCake->id,
            $readyCake->name,
            $readyCake->description,
            $readyCake->composition,
            $readyCake->weight,
            $readyCake->price,
            $readyCake->id_product
        );
    }
}
