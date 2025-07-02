<?php

namespace App\Models\Responses;

class IngredientResponse
{
    public function __construct(
        public int    $id,
        public string $name,
        public string $measurement,
        public float  $quantity_in_stock,
    )
    {
    }
}
