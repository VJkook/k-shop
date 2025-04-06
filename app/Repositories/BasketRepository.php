<?php

namespace App\Repositories;

use App\Models\Basket;
use App\Models\Responses\BasketResponse;

class BasketRepository
{
    public function create(int $userId, int $productId, int $count = 1): BasketResponse
    {
        /** @var Basket $basket */
        $basket = Basket::query()->create([
            'id_product' => $productId,
            'id_user' => $userId,
            'count' => $count
        ]);

        return $this->getItemById($basket->id, $userId);
    }

    /**
     * @return BasketResponse[]
     */
    public function getItemsByUserId(int $userId): array
    {
        $rows = Basket::query()
            ->select(
                'baskets.id',
                'baskets.id_product',
                'id_user',
                'count',
                'rp.weight',
                'rp.price',
                'rp.name AS product_name'
            )
            ->join('ready_cakes AS rp', 'baskets.id_product', '=', 'rp.id_product')
            ->where('id_user', $userId)
            ->get();

        $imageRepo = new ImageRepository();
        $response = [];
        foreach ($rows as $row) {
            $url = $imageRepo->getUrlFirstByProductId($row['id_product']);
            $arr = $row->toArray();
            $response[] = new BasketResponse(
                $arr['id'],
                $arr['product_name'],
                $arr['weight'],
                $arr['price'],
                $arr['count'],
                $arr['id_product'],
                $url
            );
        }

        return $response;
    }

    public function getItemById(int $id, int $userId): BasketResponse
    {
        $row = Basket::query()
            ->select(
                'baskets.id',
                'baskets.id_product',
                'id_user',
                'count',
                'rp.weight',
                'rp.price',
                'rp.name AS product_name'
            )
            ->join('ready_cakes AS rp', 'baskets.id_product', '=', 'rp.id_product')
            ->where('id_user', $userId)
            ->where('baskets.id', $id)
            ->first();

        $imageRepo = new ImageRepository();
        $url = $imageRepo->getUrlFirstByProductId($row->id_product);

        $arr = $row->toArray();
        return new BasketResponse(
            $arr['id'],
            $arr['product_name'],
            $arr['weight'],
            $arr['price'],
            $arr['count'],
            $arr['id_product'],
            $url
        );
    }

    public function updateById(int $id, int $userId, int $count): BasketResponse
    {
        /** @var Basket $basket */
        $basket = Basket::query()->where('id_user', '=', $userId)->find($id);
        $basket->count = $count;
        $basket->save();

        return $this->getItemById($id, $userId);
    }

    public function deleteById(int $id): bool
    {
        return (bool)Basket::query()->where('id', '=', $id)->delete();
    }
}
