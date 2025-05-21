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

    public static function fromDecor(Decor $decor): self
    {
        return new DecorResponse(
            $decor->id,
            $decor->name,
            $decor->description,
            $decor->price
        );
    }
}
