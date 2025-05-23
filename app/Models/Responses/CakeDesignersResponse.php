<?php

namespace App\Models\Responses;

class CakeDesignersResponse
{
    /**
     * @param int $id
     * @param string $name
     * @param string|null $description
     * @param float|null $weight
     * @param float|null $total_cost
     * @param int $id_coverage
     * @param int $id_cake_form
     * @param int $id_product
     * @param ImageResponse[] $images
     * @param int $count
     */
    public function __construct(
        public int         $id,
        public string      $name,
        public string|null $description,
        public float|null  $weight,
        public float|null  $total_cost,
        public int         $id_coverage,
        public int         $id_cake_form,
        public int         $id_product,
        public array       $images = [],
        public int         $count = 1
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

    public function setCount(int $count): void
    {
        $this->$count = $count;
    }

//    public static function fromDto(CakeDesigner $cakeDesigner): self
//    {
//        return new CakeDesignersResponse(
//            $cakeDesigner->id,
//            $cakeDesigner->name,
//            $cakeDesigner->description,
//            $cakeDesigner->weight,
//            $cakeDesigner->total_cost,
//            $cakeDesigner->id_coverage,
//            $cakeDesigner->id_cake_form,
//        );
//    }
}
