<?php

namespace App\Models\Responses;

class BasketDetailsResponse
{
    /**
     * @param TierResponse[] $tiers
     * @param DecorResponse[] $decors
     */
    public function __construct(
        public array $tiers,
        public array $decors,
    )
    {
    }
}
