<?php

namespace App\Models\Responses;

use App\Models\TechnologicalMap;

class TechnologicalMapResponse
{
    public function __construct(
        public int         $id,
        public string      $name,
        public string|null $description = null,
        public string|null $cooking_time = null,
        public array       $cooking_steps = [],
    )
    {
    }

    public function setCookingSteps(array $cooking_steps): void
    {
        $this->cooking_steps = $cooking_steps;
    }

    public static function fromModel(TechnologicalMap $technologicalMap): self
    {
        return new TechnologicalMapResponse(
            $technologicalMap->id,
            $technologicalMap->name,
            $technologicalMap->description,
        );
    }
}
