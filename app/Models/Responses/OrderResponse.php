<?php

namespace App\Models\Responses;

use App\Models\BasicDate;
use App\Models\BasicIntervalTime;

class OrderResponse
{

    /**
     * @param int $id
     * @param float $total_cost
     * @param BasicDate $registration_date
     * @param BasicDate|null $delivery_date
     * @param string|null $work_date
     * @param BasicDate|null $completed_date
     * @param string $delivery_address
     * @param string $status
     * @param string $payment_status
     * @param int|null $id_confectioner
     * @param string $work_time
     * @param OrderOrBasketItemResponse[] $products
     */
    public function __construct(
        public int            $id,
        public float          $total_cost,
        public BasicDate      $registration_date,
        public BasicDate|null $delivery_date,
        public string|null $work_date,
        public BasicDate|null $completed_date,
        public string         $delivery_address,
        public string         $status,
        public string         $payment_status,
        public int|null       $id_confectioner,
        public string         $work_time,
        public array          $products = [],
    )
    {
    }
}
