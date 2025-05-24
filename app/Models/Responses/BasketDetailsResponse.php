<?php

namespace App\Models\Responses;

class BasketDetailsResponse
{
    /**
     * @param TierResponse[] $tiers
     * @param CakeDesignerDecorResponse[] $decors
     */
    public function __construct(
        public array            $tiers,
        public array            $decors,
        public CoverageResponse $coverage,
    )
    {
    }
}
