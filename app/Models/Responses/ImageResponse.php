<?php

namespace App\Models\Responses;

class ImageResponse
{
    public function __construct(
        public int $id,
        public string $url,
    )
    {
    }
}
