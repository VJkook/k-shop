<?php

namespace App\Models\Responses\Users;

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
