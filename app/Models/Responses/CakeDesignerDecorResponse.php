<?php

namespace App\Models\Responses;

use App\Models\Decor;

class CakeDesignerDecorResponse
{
    public function __construct(
        public int                $id,
        public string             $name,
        public string|null        $description,
        public float              $price,
        public int                $count,
        public ImageResponse|null $image = null,
    )
    {
    }

    public function setImage(ImageResponse $image): void
    {
        $this->image = $image;
    }

    public static function fromDecorResponse(DecorResponse $decorResponse, int $count): self
    {
        return new self(
            $decorResponse->id,
            $decorResponse->name,
            $decorResponse->description,
            $decorResponse->price,
            $count,
            $decorResponse->image,
        );
    }
}
