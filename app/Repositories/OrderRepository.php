<?php

namespace App\Repositories;

use App\Models\BasicDate;
use App\Models\DeliveryAddress;
use App\Models\Image;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\PaymentStatus;
use App\Models\Product;
use App\Models\ProductOrderRelation;
use App\Models\ReadyCake;
use App\Models\Responses\BasketResponse;
use App\Models\Responses\DeliveryAddressResponse;
use App\Models\Responses\ImageResponse;
use App\Models\Responses\OrderResponse;
use App\Models\Responses\ReadyCakeResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class OrderRepository
{
    /**
     * @param int $userId
     * @param int $deliveryAddressId
     * @param BasketResponse[] $baskets
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
            'id_payment_status' => PaymentStatus::PAY_WAITING,
            'id_order_status' => OrderStatus::CONFIRM_WAITING,
        ];
        if (!is_null($deliveryDate)) {
            $attributes['delivery_date'] = $deliveryDate;
        }

        $orderResponse = null;
        DB::transaction(function () use ($baskets, $attributes, &$orderResponse) {
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

            $orderResponse = $this->buildResponse($order);
        });

        return $orderResponse;
    }

    /**
     * @param int $userId
     * @return OrderResponse[]
     */
    public function getAll(int $userId): array
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

    private function buildResponse(Order $order): OrderResponse
    {
        $readyCakesResponses = [];

        /** @var Product $product */
        foreach ($order->products()->get() as $product) {
            /** @var ReadyCake $readyCake */
            $readyCake = $product->readyCake()->first();
            $readyCakesResponse = ReadyCakeResponse::fromReadyCake($readyCake, $product->id);

            /** @var Image[] $image */
            $images = $readyCake->images()->get();
            $imagesResponses = [];
            foreach ($images as $image) {
                $imagesResponses[] = new ImageResponse(
                    $image->id,
                    $image->getUrl()
                );
            }

            $readyCakesResponse->setImages($imagesResponses);
            $readyCakesResponses[] = $readyCakesResponse;
        }

        /** @var DeliveryAddress $deliveryAddress */
        $deliveryAddress = $order->deliveryAddress()->first();
        /** @var PaymentStatus $paymentStatus */
        $paymentStatus = $order->paymentStatus()->first();

        /** @var OrderStatus $orderStatus */
        $orderStatus = $order->orderStatus()->first();;
        return new OrderResponse(
            $order->id,
            $order->total_cost,
            BasicDate::fromCarbon($order->registration_date),
            $order->delivery_date,
            $order->complete_date,
            $deliveryAddress->address,
            $orderStatus->name,
            $paymentStatus->name,
            $readyCakesResponses
        );
    }
}
