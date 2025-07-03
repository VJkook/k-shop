<?php

namespace App\Models\Responses;

class OrderOrBasketItemResponse
{
    /**
     * @param int $id
     * @param string $name
     * @param float|null $weight
     * @param float|null $price
     * @param int $count
     * @param int $id_product
     * @param string|null $image
     * @param DetailsResponse|null $details
     * @param int|null $id_recipe
     */
    public function __construct(
        public readonly int         $id,
        public readonly string      $name,
        public readonly float|null  $weight,
        public readonly float|null  $price,
        public readonly int         $count,
        public readonly int         $id_product,
        public string|null          $image = '',
        public DetailsResponse|null $details = null,
        public readonly int|null    $id_recipe = null,
    )
    {
    }
}
