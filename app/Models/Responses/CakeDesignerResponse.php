<?php

namespace App\Models\Responses;

use App\Models\CakeDesigner;
use App\Models\Filling;

class CakeDesignerResponse
{
    /**
     * @param int $id
     * @param string $name
     * @param string|null $description
     * @param float|null $weight
     * @param float|null $total_cost
     * @param int $id_coverage
     * @param ImageResponse[] $images
     */
    public function __construct(
        public int         $id,
        public string      $name,
        public string|null $description,
        public float|null  $weight,
        public float|null  $total_cost,
        public int         $id_coverage,
        public array       $images = [],
    )
    {
    }

    /**
     * @param ImageResponse[] $images
     * @return void
     */
    public function setImages(array $images): void
    {
        $this->images = $images;
    }

    public static function fromDto(CakeDesigner $cakeDesigner): self
    {
        return new CakeDesignerResponse(
            $cakeDesigner->id,
            $cakeDesigner->name,
            $cakeDesigner->description,
            $cakeDesigner->price_by_kg
        );
    }
}
