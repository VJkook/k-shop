<?php

namespace App\Models\Responses;

use App\Models\Filling;

class FillingResponse
{
    public function __construct(
        public int                $id,
        public string             $name,
        public string|null        $description,
        public float              $price_by_kg,
        public ImageResponse|null $image = null,
    )
    {
    }

    public function setImage(ImageResponse $image): void
    {
        $this->image = $image;
    }

    public static function fromFilling(Filling $filling): self
    {
        return new FillingResponse(
            $filling->id,
            $filling->name,
            $filling->description,
            $filling->price_by_kg
        );
    }
}
