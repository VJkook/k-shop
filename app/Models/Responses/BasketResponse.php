<?php

namespace App\Models\Responses;

class BasketResponse
{
    /**
     * @param int $id
     * @param string $product_name
     * @param float|null $weight
     * @param float|null $price
     * @param int $count
     * @param int $id_product
     * @param CoverageResponse $coverage
     * @param string|null $image
     * @param BasketDetailsResponse|null $details
     */
    public function __construct(
        public readonly int               $id,
        public readonly string            $product_name,
        public readonly float|null        $weight,
        public readonly float|null        $price,
        public readonly int               $count,
        public readonly int               $id_product,
        public readonly CoverageResponse  $coverage,
        public string|null                $image = '',
        public BasketDetailsResponse|null $details = null
    )
    {
    }
}
