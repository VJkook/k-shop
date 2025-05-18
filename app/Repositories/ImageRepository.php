<?php

namespace App\Repositories;

use App\Models\Image;
use App\Models\ProductImageRelation;
use App\Models\ReadyCakeImageRelation;

class ImageRepository
{
    public function getUrlFirstByReadyCakeId(int $readyCakeId): string|null
    {
        /** @var Image $image */
        $image = Image::query()
            ->select(Image::TABLE_NAME . '.id')
            ->join(ReadyCakeImageRelation::TABLE_NAME . ' as rci', 'rci.id_image', '=', 'images.id')
            ->where('id_ready_cake', '=', $readyCakeId)
            ->first();

        if (isset($image)) {
            return $image->getUrl();
        }

        return null;
    }
}
