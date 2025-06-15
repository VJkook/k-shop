<?php

namespace App\Models\Responses;

class ErrorResponse
{
    public function __construct(public string $msg)
    {
    }
}
