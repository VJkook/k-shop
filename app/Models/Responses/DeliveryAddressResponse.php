<?php

namespace App\Models\Responses;

class DeliveryAddressResponse
{
    public function __construct(
        public readonly int    $id,
        public readonly string $address,
    )
    {
    }
}
