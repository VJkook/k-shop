<?php

namespace App\Models\Responses;

use App\Models\Coverage;

class CoverageResponse
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

    public static function fromCoverage(Coverage $filling): self
    {
        return new CoverageResponse(
            $filling->id,
            $filling->name,
            $filling->description,
            $filling->price
        );
    }
}
