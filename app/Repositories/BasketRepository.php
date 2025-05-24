<?php

namespace App\Repositories;

use App\Models\Basket;
use App\Models\CakeDesigner;
use App\Models\CakeDesignerDecorRelation;
use App\Models\Coverage;
use App\Models\Decor;
use App\Models\Filling;
use App\Models\Image;
use App\Models\Product;
use App\Models\Responses\BasketDetailsResponse;
use App\Models\Responses\BasketResponse;
use App\Models\Responses\CakeDesignerDecorResponse;
use App\Models\Responses\CoverageResponse;
use App\Models\Responses\DecorResponse;
use App\Models\Responses\TierResponse;
use App\Models\Tier;
use Illuminate\Database\Eloquent\Builder;

class BasketRepository
{
    const CAKE_DESIGNER_TYPE = 'cake-designer';
    const READY_CAKE_TYPE = 'ready-cake';

    public function create(int $userId, int $productId, int $count = 1): array
    {
        /** @var Basket $basket */
        Basket::query()->create([
            'id_product' => $productId,
            'id_user' => $userId,
            'count' => $count
        ]);

        return $this->getItemsByUserId($userId);
    }

    /**
     * @return BasketResponse[]
     */
    public function getItemsByUserId(int $userId): array
    {
        $basketItems = $this->buildBasketQuery($userId)->get();

        $imageRepo = new ImageRepository();
        $productRepo = new ProductRepository();
        $response = [];
        foreach ($basketItems as $basketItem) {
            $url = $imageRepo->getUrlFirstByReadyCakeId($basketItem['id_product']);
            $product = $productRepo->getById($basketItem['id_product']);
            $arr = $basketItem->toArray();

            /** @var BasketDetailsResponse|null $basketDetailResponse */
            $basketDetailResponse = null;
            if (!is_null($product->id_cake_designer)) {
                /** @var CakeDesignerDecorResponse[] $decorResponses */
                $decorResponses = [];
                /** @var TierResponse[] $tierResponses */
                $tierResponses = [];

                /** @var CakeDesigner $cakeDesigner */
                $cakeDesigner = $product->cakeDesigner()->first();

                /** @var Tier[] $tiers */
                $tiers = $cakeDesigner->tiers()->get();
                foreach ($tiers as $tier) {
                    /** @var Filling $filling */
                    $filling = $tier->filling()->first();
                    $fillingResponse = $filling->toResponse();
                    $tierResponse = new TierResponse($tier->id, $fillingResponse, $tier->weight);
                    $tierResponses[] = $tierResponse;
                }

                /** @var CakeDesignerDecorRelation[] $decorRelations */
                $decorRelations = $cakeDesigner->cakeDesignerDecorRelations()->get();
                foreach ($decorRelations as $decorRelation) {
                    /** @var Decor $decor */
                    $decor = $decorRelation->decor()->first();
                    $decorResponse = $decor->toResponse();
                    $decorResponses[] = CakeDesignerDecorResponse::fromDecorResponse(
                        $decorResponse,
                        $decorRelation->count
                    );
                }

                /** @var Coverage $coverage */
                $coverage = $cakeDesigner->coverage()->first();
                $basketDetailResponse = new BasketDetailsResponse(
                    $tierResponses,
                    $decorResponses,
                    $coverage->toResponse()
                );
            }

            $response[] = new BasketResponse(
                $arr['id'],
                $arr['product_name'],
                $arr['weight'],
                $arr['price'],
                $arr['count'],
                $arr['id_product'],
                $coverage->toResponse(),
                $url,
                $basketDetailResponse
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

    private function buildBasketQuery(string $userId): Builder
    {
        return Basket::query()
            ->select(
                Basket::TABLE_NAME . '.id',
                Basket::TABLE_NAME . '.id_product',
                Basket::TABLE_NAME . '.id_user',
                'count',
                'rp.price',
            )
            ->selectRaw('COALESCE(rp.name, cd.name) AS product_name')
            ->selectRaw('COALESCE(rp.weight, cd.weight) AS weight')
            ->selectRaw('COALESCE(rp.price, cd.total_cost) AS price')
            ->join('products AS p', Basket::TABLE_NAME . '.id_product', '=', 'p.id')
            ->leftJoin('ready_cakes AS rp', 'p.id_ready_cake', '=', 'rp.id')
            ->leftJoin('cake_designers AS cd', 'p.id_cake_designer', '=', 'cd.id')
            ->where(Basket::TABLE_NAME . '.id_user', $userId)
            ->orderBy(Basket::TABLE_NAME . '.created_at');
    }

    /**
     * @param int $id
     * @param int $userId
     * @param int $count
     * @return BasketResponse[]
     */
    public function updateById(int $id, int $userId, int $count): array
    {
        /** @var Basket $basket */
        $basket = Basket::query()->where('id_user', '=', $userId)->find($id);
        $basket->count = $count;
        $basket->save();

        return $this->getItemsByUserId($userId);
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
