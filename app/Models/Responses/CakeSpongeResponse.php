<?php

namespace App\Models\Responses;

use App\Models\CakeSponge;

class CakeSpongeResponse
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

    public static function fromFCakeSponge(CakeSponge $filling): self
    {
        return new CakeSpongeResponse(
            $filling->id,
            $filling->name,
            $filling->description,
            $filling->price
        );
    }
}
