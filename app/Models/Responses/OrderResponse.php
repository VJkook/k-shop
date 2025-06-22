<?php

namespace App\Models\Responses;

use App\Models\BasicDate;
use App\Models\Responses\Users\ConfectionerResponse;

class OrderResponse
{

    /**
     * @param int $id
     * @param float $total_cost
     * @param string $registration_date
     * @param string $delivery_date
     * @param string $work_date
     * @param string|null $completed_date
     * @param string $delivery_address
     * @param OrderStatusResponse $status
     * @param string $payment_status
     * @param ConfectionerResponse|null $confectioner
     * @param string $work_time
     * @param UserResponse $client
     * @param OrderOrBasketItemResponse[] $products
     */
    public function __construct(
        public int                       $id,
        public float                     $total_cost,
        public string                    $registration_date,
        public string                    $delivery_date,
        public string                    $work_date,
        public string|null               $completed_date,
        public string                    $delivery_address,
        public OrderStatusResponse       $status,
        public string                    $payment_status,
        public ConfectionerResponse|null $confectioner,
        public string                    $work_time,
        public UserResponse              $client,
        public array                     $products,
    )
    {
    }
}
