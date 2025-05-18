<?php

namespace App\Models\Responses;

class BasketResponse
{
    public function __construct(
        public readonly int        $id,
        public readonly string     $product_name,
        public readonly float|null $weight,
        public readonly float      $price,
        public readonly int        $count,
        public readonly int        $id_product,
        public string|null         $image = ''
    )
    {
    }

    public function setImage(string $image): void
    {
        $this->image = $image;
    }
}
