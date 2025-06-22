<?php

namespace App\Models\Responses;

class OrderStatusResponse
{
    public function __construct(
        public int    $id,
        public string $name,
        public string $color,
    )
    {
    }
}
