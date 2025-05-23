<?php

namespace App\Models\Responses;

class aDeliveryAddressResponse
{
    public function __construct(
        public readonly int    $id,
        public readonly string $address,
    )
    {
    }
}
