<?php

namespace App\Models\Requests;

class TierRequest
{
    public function __construct(
        public int $id_filling,
        public float $weight,
    )
    {
    }

    public function toArray(): array
    {
        return [
            'weight' => $this->weight,
            'id_filling' => $this->id_filling,
        ];
    }
}
