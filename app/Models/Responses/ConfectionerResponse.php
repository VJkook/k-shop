<?php

namespace App\Models\Responses;

use App\Models\User;

class ConfectionerResponse
{
    public function __construct(
        public int    $id,
        public string $name,
        public string $email,
        public string $role,
    )
    {
    }
}
