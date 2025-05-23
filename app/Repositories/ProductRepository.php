<?php

namespace App\Repositories;

use App\Models\Product;
use App\Models\ReadyCake;

class ProductRepository
{
    public function create(?int $id_ready_cake = null, ?int $id_cake_designer = null): Product
    {
        $attributes = [
            'id_cake_designer' => $id_cake_designer,
            'id_ready_cake' => $id_ready_cake,
        ];

        /** @var Product $product */
        $product = Product::query()->create($attributes);
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
        $product = Product::query()->find($id);
        return $product;
    }
}
