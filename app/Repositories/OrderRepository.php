<?php

namespace App\Repositories;

use App\Models\BasicDate;
use App\Models\BasicIntervalTime;
use App\Models\CakeDesigner;
use App\Models\CakeDesignerDecorRelation;
use App\Models\Coverage;
use App\Models\Decor;
use App\Models\DeliveryAddress;
use App\Models\Filling;
use App\Models\Image;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\PaymentStatus;
use App\Models\Product;
use App\Models\ProductOrderRelation;
use App\Models\ReadyCake;
use App\Models\Responses\DetailsResponse;
use App\Models\Responses\OrderOrBasketItemResponse;
use App\Models\Responses\CakeDesignerDecorResponse;
use App\Models\Responses\OrderResponse;
use App\Models\Responses\TierResponse;
use App\Models\Tier;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class OrderRepository
{
    /**
     * @param int $userId
     * @param int $deliveryAddressId
     * @param OrderOrBasketItemResponse[] $baskets
     * @param Carbon|null $deliveryDate
     * @return OrderResponse
     */
    public function create(
        int     $userId,
        int     $deliveryAddressId,
        array   $baskets,
        ?Carbon $deliveryDate = null
    ): OrderResponse
    {
        $attributes = [
            'id_user' => $userId,
            'id_delivery_address' => $deliveryAddressId,
            'id_payment_status' => PaymentStatus::CONFIRM_WAITING,
            'id_order_status' => OrderStatus::CONFIRM_WAITING,
        ];

        if (!is_null($deliveryDate)) {
            $attributes['delivery_date'] = $deliveryDate;
            $deliveryDate = clone $deliveryDate;
            $attributes['work_date'] = $deliveryDate->subDay();
        }

        $order = null;
        DB::transaction(function () use ($baskets, $attributes, &$order) {
            $totalCost = 0;
            /** @var Order $order */
            foreach ($baskets as $basket) {
                $totalCost += $basket->price * $basket->count;
            }

            $attributes['total_cost'] = $totalCost;
            $attributes['registration_date'] = BasicDate::now();
            $order = Order::query()->create($attributes);
            foreach ($baskets as $basket) {
                ProductOrderRelation::query()->create([
                    'id_order' => $order->id,
                    'id_product' => $basket->id_product,
                    'count' => $basket->count,
                ]);
            }
        });

        return $this->getById($order->id);
    }

    /**
     * @param int $userId
     * @return OrderResponse[]
     */
    public function getByUserId(int $userId): array
    {
        /** @var Order[] $orders */
        $orders = Order::query()
            ->where('id_user', '=', $userId)
            ->orderBy('registration_date', 'desc')
            ->get();
        $response = [];
        foreach ($orders as $order) {
            $response[] = $this->buildResponse($order);
        }

        return $response;
    }

    public function getById(int $id): OrderResponse
    {
        /** @var Order $order */
        $order = Order::query()
            ->where('id', '=', $id)
            ->orderBy('registration_date', 'desc')
            ->first();

        return $this->buildResponse($order);
    }

    /**
     * @return OrderResponse[]
     */
    public function all(): array
    {
        /** @var Order[] $orders */
        $orders = Order::query()
            ->orderBy('registration_date', 'desc')
            ->get();
        $response = [];
        foreach ($orders as $order) {
            $response[] = $this->buildResponse($order);
        }

        return $response;
    }

    private function buildResponse(Order $order): OrderResponse
    {
        $orderItems = [];

        /** @var Product $product */
        foreach ($order->products()->get() as $product) {

            $productName = '';
            $price = $weight = 0;


            $imageUrl = null;
            /** @var DetailsResponse|null $detailResponse */
            $detailResponse = null;
            if (!is_null($product->id_cake_designer)) {
                /** @var CakeDesignerDecorResponse[] $decorResponses */
                $decorResponses = [];
                /** @var TierResponse[] $tierResponses */
                $tierResponses = [];

                /** @var CakeDesigner $cakeDesigner */
                $cakeDesigner = $product->cakeDesigner()->first();
                $weight = $cakeDesigner->weight;
                $price = $cakeDesigner->total_cost;
                $productName = $cakeDesigner->name;
                /** @var Image $image */
                $image = $cakeDesigner->images()->first();
                if (!is_null($image)) {
                    $imageUrl = $image->getUrl();
                }

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
                $detailResponse = new DetailsResponse(
                    $tierResponses,
                    $decorResponses,
                    $coverage->toResponse()
                );
            } elseif ($product->id_ready_cake) {
                /** @var ReadyCake $readyCake */
                $readyCake = $product->readyCake()->first();
                $productName = $readyCake->name;
                $price = $readyCake->price;
                $weight = $readyCake->weight;

                /** @var Image $image */
                $image = $readyCake->images()->first();
                if (!is_null($image)) {
                    $imageUrl = $image->getUrl();
                }
            }

            /** @var ProductOrderRelation $productOrderRelation */
            $productOrderRelation = ProductOrderRelation::query()
                ->where('id_product', '=', $product->id)
                ->where('id_order', '=', $order->id)
                ->first();

            $count = $productOrderRelation->count;
            $orderItems[] = new OrderOrBasketItemResponse(
                $order->id,
                $productName,
                $weight,
                $price,
                $count,
                $product->id,
                $imageUrl,
                $detailResponse
            );
        }

        /** @var DeliveryAddress $deliveryAddress */
        $deliveryAddress = $order->deliveryAddress()->first();
        /** @var PaymentStatus $paymentStatus */
        $paymentStatus = $order->paymentStatus()->first();

        /** @var OrderStatus $orderStatus */
        $orderStatus = $order->orderStatus()->first();

        $deliveryDate = !is_null($order->delivery_date) ? BasicDate::fromCarbon($order->delivery_date) : null;
        $workDate = !is_null($order->work_date) ? BasicDate::fromCarbon($order->work_date) : null;
        $completeDate = !is_null($order->complete_date) ? BasicDate::fromCarbon($order->complete_date) : null;
        $workTime = $this->getOrderCookingTime($order->id);

        return new OrderResponse(
            $order->id,
            $order->total_cost,
            BasicDate::fromCarbon($order->registration_date),
            $deliveryDate,
            $workDate->toStringYearDayMonth(),
            $completeDate,
            $deliveryAddress->address,
            $orderStatus->name,
            $paymentStatus->name,
            $order->id_confectioner,
            $workTime->toStringInterval(),
            $orderItems
        );
    }

    public function getOrderCookingTime(int $orderId): BasicIntervalTime
    {
        /** @var Order $order */
        $order = Order::query()->where('id', '=', $orderId)->first();

        /** @var Product[] $products */
        $products = $order->products()->get();

        $resultTime = new BasicIntervalTime(0);
        foreach ($products as $product) {
            if (!is_null($product->id_ready_cake)) {
                $readyCakeRepo = new ReadyCakeRepository();
                $interval = $readyCakeRepo->getCookingTimeById($product->id_ready_cake);
                if (!is_null($interval)) {
                    $resultTime->add($interval);
                }
            }
        }

        return $resultTime;
    }

    public function setConfectionerToOrder(int $orderId, int $confectionerId): OrderResponse
    {
        /** @var Order $order */
        $order = Order::query()->where('id', '=', $orderId)->first();

        DB::transaction(function () use ($confectionerId, $orderId, &$order) {
            $confectionerRepo = new ConfectionerRepository();

            $workDate = BasicDate::fromCarbon($order->work_date);
            $orderCookingTime = $this->getOrderCookingTime($orderId);

            $confectionerRepo->addBusyTime($confectionerId, $workDate, $orderCookingTime);

            $order->id_order_status = OrderStatus::COOKING;
            $order->id_confectioner = $confectionerId;
            $order->save();
        });

        return $this->buildResponse($order);
    }
}
