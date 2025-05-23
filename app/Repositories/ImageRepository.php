<?php

namespace App\Repositories;

use App\Models\CakeDesigner;
use App\Models\Image;
use App\Models\ReadyCake;

class ImageRepository
{
    public function getUrlFirstByReadyCakeId(int $productId): string|null
    {
        $productRepo = new ProductRepository();
        $product = $productRepo->getById($productId);

        if (!is_null($product->id_ready_cake)) {
            /** @var ReadyCake $readyCake */
            $readyCake = $product->readyCake()->first();
            /** @var Image $image */
            $image = $readyCake->images()->first();
        } elseif (!is_null($product->id_cake_designer)) {
            /** @var CakeDesigner $cakeDesigner */
            $cakeDesigner = $product->cakeDesigner()->first();
            /** @var Image $image */
            $image = $cakeDesigner->images()->first();
        }

        if (isset($image)) {
            return $image->getUrl();
        }

        return null;
    }
}
