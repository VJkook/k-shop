<?php

namespace App\Models\Responses;

use App\Models\Decor;

class DecorResponse
{
    public function __construct(
        public int                $id,
        public string             $name,
        public string|null        $description,
        public float              $price,
        public ImageResponse|null $image = null,
    )
    {
    }

    public function setImage(ImageResponse $image): void
    {
        $this->image = $image;
    }
}
