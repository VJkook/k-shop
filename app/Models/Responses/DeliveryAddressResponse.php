<?php

namespace App\Models\Responses;

class DeliveryAddressResponse
{
    public function __construct(
        public int          $id,
        public string       $address,
        public UserResponse $user,
        public string|null  $index = null,
        public string|null  $comment = null
    )
    {
    }
}
