<?php

namespace App\Repositories;

use App\Models\CakeDesigner;
use App\Models\CakeDesignerDecorRelation;
use App\Models\Image;
use App\Models\Requests\DecorRequest;
use App\Models\Requests\TierRequest;
use App\Models\Responses\CakeDesignerResponse;
use App\Models\Responses\ImageResponse;
use App\Models\Tier;
use Illuminate\Support\Facades\DB;

class CakeDesignerRepository
{
    public function create(array $attributes): ?CakeDesignerResponse
    {
        /** @var CakeDesigner|null $cakeDesigner */
        $cakeDesigner = null;
        DB::transaction(function () use (&$cakeDesigner, $attributes) {
            /** @var TierRequest[] $tiers */
            $tiers = $attributes['tiers'];
            unset($attributes['tiers']);
            /** @var DecorRequest[] $decors */
            $decors = $attributes['decors'];
            unset($attributes['decors']);

            /** @var CakeDesigner $cakeDesigner */
            $cakeDesigner = CakeDesigner::query()->create($attributes);

            foreach ($tiers as $tier) {
                $arr = $tier->toArray();
                $arr['id_cake_designer'] = $cakeDesigner->id;
                Tier::query()->create($arr);
            }

            foreach ($decors as $decor) {
                $arr = [
                    'id_cake_designer' => $cakeDesigner->id,
                    'id_decor' => $decor->id,
                    'count' => $decor->count,
                ];

                CakeDesignerDecorRelation::query()->create($arr);
            }
        });

        return $this->getById($cakeDesigner->id);
    }

    /**
     * @return CakeDesignerResponse[]
     */
    public function all(): array
    {
        $result = [];
        $fillings = CakeDesigner::query()->get();
        /** @var CakeDesigner $filling */
        foreach ($fillings as $filling) {
            $fillingResponse = $this->buildResponse($filling);
            $result[] = $fillingResponse;
        }

        return $result;
    }

    public function getById(int $id): CakeDesignerResponse
    {
        /** @var CakeDesigner $cakeDesigner */
        $cakeDesigner = CakeDesigner::query()->find($id);
        return $this->buildResponse($cakeDesigner);
    }

    public function updateById(int $id, array $attributes): CakeDesignerResponse
    {
        /** @var CakeDesigner $cakeDesigner */
        $cakeDesigner = CakeDesigner::query()->find($id);
        $cakeDesigner->update($attributes);
        return $this->getById($id);
    }

    public function deleteById(int $id): bool
    {
        return CakeDesigner::query()->find($id)->delete();
    }

    private function buildResponse(CakeDesigner $cakeDesigner): CakeDesignerResponse
    {
        $fillingResponse = new CakeDesignerResponse(
            $cakeDesigner->id,
            $cakeDesigner->name,
            $cakeDesigner->description,
            $cakeDesigner->weight,
            $cakeDesigner->total_cost,
            $cakeDesigner->id_coverage,
        );

        /** @var Image $image */
        $image = $cakeDesigner->images()->first();
        if (!is_null($image)) {
            $fillingResponse->setImages([new ImageResponse($image->id, $image->getUrl())]);
        }

        return $fillingResponse;
    }
}
