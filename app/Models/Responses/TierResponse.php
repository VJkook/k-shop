<?php

namespace App\Models\Responses;

class TierResponse
{
    public function __construct(
        public int                $id,
        public FillingResponse    $filling,
        public float              $weight,
    )
    {
    }
}
