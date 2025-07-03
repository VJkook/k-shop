<?php

namespace App\Models\Responses;

class DecorResponse
{
    public function __construct(
        public int                $id,
        public string             $name,
        public string|null        $description,
        public float              $price,
        public ImageResponse|null $image = null,
        public int|null           $id_recipe = null
    )
    {
    }

    public function setImage(ImageResponse $image): void
    {
        $this->image = $image;
    }
}
