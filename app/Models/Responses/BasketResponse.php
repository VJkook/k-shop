<?php

namespace App\Models\Responses;

class BasketResponse
{
    public function __construct(
        public readonly int    $id,
        public readonly string $product_name,
        public readonly float  $weight,
        public readonly float  $price,
        public readonly int    $count,
        public readonly int    $id_product,
    )
    {
    }
}
