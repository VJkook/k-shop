<?php

namespace App\Models\Responses;

use App\Models\BasicDate;

class OrderResponse
{

    /**
     * @param int $id
     * @param float $total_cost
     * @param BasicDate $registration_date
     * @param BasicDate|null $delivery_date
     * @param BasicDate|null $completed_date
     * @param string $delivery_address
     * @param string $status
     * @param string $payment_status
     * @param ReadyCakeResponse[] $ready_cakes
     */
    public function __construct(
        public int            $id,
        public float          $total_cost,
        public BasicDate      $registration_date,
        public BasicDate|null $delivery_date,
        public BasicDate|null $completed_date,
        public string         $delivery_address,
        public string         $status,
        public string         $payment_status,
        public array          $ready_cakes = [],
    )
    {
    }

    public function setReadyCakes(array $ready_cakes): void
    {
        $this->ready_cakes = $ready_cakes;
    }
}
