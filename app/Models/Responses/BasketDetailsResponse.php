<?php

namespace App\Models\Responses;

class BasketDetailsResponse
{
    /**
     * @param FillingResponse[] $fillings
     * @param DecorResponse[] $decors
     */
    public function __construct(
        public array $fillings,
        public array $decors,
    )
    {
    }
}
