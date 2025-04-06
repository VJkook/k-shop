<?php

namespace App\Repositories;

use App\Models\Image;
use App\Models\ProductImageRelation;

class ImageRepository
{
    public function getUrlFirstByProductId(int $productId): string
    {
        /** @var Image $image */
        $image = Image::query()
            ->join(ProductImageRelation::TABLE_NAME . ' as pi', 'pi.id_image', '=', 'images.id')
            ->where('id_product', '=', $productId)
            ->first();

        if ($image) {
            return $image->getUrl();
        }

        return '';
    }
}
