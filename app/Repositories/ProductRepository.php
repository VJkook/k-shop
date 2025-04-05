<?php

namespace App\Repositories;

use App\Models\Product;
use App\Models\ReadyCake;

class ProductRepository
{
    public function create(): Product
    {
        /** @var Product $product */
        $product = Product::query()->create();
        return $product;
    }

    /**
     * @return Product[]
     */
    public function all(): array
    {
        return Product::query()->get();
    }

    public function getById(int $id): Product
    {
        /** @var Product $product */
        $product = ReadyCake::query()->find($id);
        return $product;
    }
}
