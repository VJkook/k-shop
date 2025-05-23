<?php

namespace App\Repositories;

use App\Models\Basket;
use App\Models\Product;
use App\Models\Responses\BasketResponse;
use Illuminate\Database\Eloquent\Builder;

class BasketRepository
{
    const CAKE_DESIGNER_TYPE = 'cake-designer';
    const READY_CAKE_TYPE = 'ready-cake';
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
        $rows = $this->buildBasketQuery($userId)->get();

        $imageRepo = new ImageRepository();
        $productRepo = new ProductRepository();
        $response = [];
        foreach ($rows as $row) {
            $url = $imageRepo->getUrlFirstByReadyCakeId($row['id_product']);
            $product = $productRepo->getById($row['id_product']);
            $itemType = $this->getItemTypeByProduct($product);
            $arr = $row->toArray();
            $response[] = new BasketResponse(
                $arr['id'],
                $arr['product_name'],
                $arr['weight'],
                $arr['price'],
                $arr['count'],
                $arr['id_product'],
                $itemType,
                $url
            );
        }

        return $response;
    }

    private function getItemTypeByProduct(Product $product): string
    {
        if (!is_null($product->id_cake_designer)) {
            return self::CAKE_DESIGNER_TYPE;
        }

        if (!is_null($product->id_ready_cake)) {
            return self::READY_CAKE_TYPE;
        }

        return '';
    }

    public function getItemById(int $id, int $userId): BasketResponse
    {
        $row = $this->buildBasketQuery($userId)->where('baskets.id', $id)->first();

        $imageRepo = new ImageRepository();
        $url = $imageRepo->getUrlFirstByReadyCakeId($row->id_product);

        $productRepo = new ProductRepository();
        $product = $productRepo->getById($row['id_product']);
        $itemType = $this->getItemTypeByProduct($product);

        $arr = $row->toArray();
        return new BasketResponse(
            $arr['id'],
            $arr['product_name'],
            $arr['weight'],
            $arr['price'],
            $arr['count'],
            $arr['id_product'],
            $itemType,
            $url
        );
    }

    private function buildBasketQuery(string $userId): Builder
    {
        return Basket::query()
            ->select(
                'baskets.id',
                'baskets.id_product',
                'baskets.id_user',
                'count',
                'rp.price',
            )
            ->selectRaw('COALESCE(rp.name, cd.name) AS product_name')
            ->selectRaw('COALESCE(rp.weight, cd.weight) AS weight')
            ->selectRaw('COALESCE(rp.price, cd.total_cost) AS price')
            ->join('products AS p', 'baskets.id_product', '=', 'p.id')
            ->leftJoin('ready_cakes AS rp', 'p.id_ready_cake', '=', 'rp.id')
            ->leftJoin('cake_designers AS cd', 'p.id_cake_designer', '=', 'cd.id')
            ->where('baskets.id_user', $userId);
    }

    public function updateById(int $id, int $userId, int $count): BasketResponse
    {
        /** @var Basket $basket */
        $basket = Basket::query()->where('id_user', '=', $userId)->find($id);
        $basket->count = $count;
        $basket->save();

        return $this->getItemById($id, $userId);
    }

    public function deleteById(int $id, int $userId): bool
    {
        return (bool)Basket::query()
            ->where('id', '=', $id)
            ->where('id_user', '=', $userId)
            ->delete();
    }

    public function clearBasket(int $userId): bool
    {
        return (bool)Basket::query()->where('id_user', '=', $userId)->delete();
    }
}
