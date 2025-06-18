<?php

namespace App\Models\Responses\Users;

class ConfectionerBusyResponse
{
    public function __construct(
        public int         $id,
        public string      $name,
        public string      $email,
        public string|null $busy_time = null
    )
    {
    }
}
