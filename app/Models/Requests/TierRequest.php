<?php

namespace App\Models\Requests;

class TierRequest
{
    public function __construct(
        public int $id_cake_sponge,
        public int $id_filling,
    )
    {
    }

    public function toArray(): array
    {
        return [
            'id_cake_sponge' => $this->id_cake_sponge,
            'id_filling' => $this->id_filling,
        ];
    }
}
