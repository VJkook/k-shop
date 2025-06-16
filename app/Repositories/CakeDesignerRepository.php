<?php

namespace App\Repositories;

use App\Models\BasicIntervalTime;
use App\Models\CakeDesigner;
use App\Models\CakeDesignerDecorRelation;
use App\Models\Decor;
use App\Models\Filling;
use App\Models\Image;
use App\Models\Product;
use App\Models\ReadyCake;
use App\Models\Recipe;
use App\Models\Requests\DecorRequest;
use App\Models\Requests\TierRequest;
use App\Models\Responses\CakeDesignersResponse;
use App\Models\Responses\ImageResponse;
use App\Models\TechnologicalMap;
use App\Models\Tier;
use Illuminate\Support\Facades\DB;

class CakeDesignerRepository
{
    public function create(array $attributes): ?CakeDesignersResponse
    {
        /** @var CakeDesigner|null $cakeDesigner */
        $cakeDesigner = null;
        DB::transaction(function () use (&$cakeDesigner, $attributes) {
            /** @var DecorRequest[] $decors */
            $decors = $attributes['decors'];
            unset($attributes['decors']);

            /** @var TierRequest[] $tiers */
            $tiers = $attributes['tiers'];
            unset($attributes['tiers']);

            /** @var CakeDesigner $cakeDesigner */
            $cakeDesigner = CakeDesigner::query()->create($attributes);

            foreach ($tiers as $tier) {
                $arr['id_filling'] = $tier->id_filling;
                $arr['id_cake_designer'] = $cakeDesigner->id;
                $arr['weight'] = $tier->weight;
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

            Product::query()->create(['id_cake_designer' => $cakeDesigner->id]);
        });

        return $this->getById($cakeDesigner->id);
    }

    /**
     * @return CakeDesignersResponse[]
     */
    public function all(): array
    {
        $result = [];
        $cakeDesigners = CakeDesigner::query()->get();
        /** @var CakeDesigner $filling */
        foreach ($cakeDesigners as $cakeDesigner) {
            $fillingResponse = $this->buildResponse($cakeDesigner);
            $result[] = $fillingResponse;
        }

        return $result;
    }

    public function getById(int $id): CakeDesignersResponse
    {
        /** @var CakeDesigner $cakeDesigner */
        $cakeDesigner = CakeDesigner::query()->find($id);
        return $this->buildResponse($cakeDesigner);
    }

    public function updateById(int $id, array $attributes): CakeDesignersResponse
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

    public function getCookingTimeById(int $id): ?BasicIntervalTime
    {
        /** @var CakeDesigner $cakeDesigner */
        $cakeDesigner = CakeDesigner::query()->find($id);

        $time = new BasicIntervalTime(0);

        /** @var Tier[] $tiers */
        $tiers = $cakeDesigner->tiers()->get();
        foreach ($tiers as $tier) {
            /** @var Filling $filling */
            $filling = $tier->filling()->first();

            /** @var Recipe $recipe */
            $recipe = $filling->recipe()->first();

            if (is_null($recipe)) {
                continue;
            }

            $cookingTime = $this->getCookingTimeOfRecipe($recipe->id);
            if (is_null($cookingTime)) {
                continue;
            }

            $time->add($cookingTime);
        }

        /** @var Decor[] $decors */
        $decors = $cakeDesigner->decors()->get();
        foreach ($decors as $decor) {
            $recipe = $decor->recipe()->first();
            if (is_null($recipe)) {
                continue;
            }
            $cookingTime = $this->getCookingTimeOfRecipe($recipe->id);
            if (is_null($cookingTime)) {
                continue;
            }

            $time->add($cookingTime);
        }

        return $time;
    }

    private function getCookingTimeOfRecipe(int $recipeId): ?BasicIntervalTime
    {
        $recipesRepo = new RecipesRepository();
        return $recipesRepo->getCookingTimeById($recipeId);
    }

    private function buildResponse(CakeDesigner $cakeDesigner): CakeDesignersResponse
    {
        /** @var Product $product */
        $product = $cakeDesigner->product()->first();
        $fillingResponse = new CakeDesignersResponse(
            $cakeDesigner->id,
            $cakeDesigner->name,
            $cakeDesigner->description,
            $cakeDesigner->weight,
            $cakeDesigner->total_cost,
            $cakeDesigner->id_coverage,
            $cakeDesigner->id_cake_form,
            $product->id
        );

        /** @var Image $image */
        $image = $cakeDesigner->images()->first();
        if (!is_null($image)) {
            $fillingResponse->setImages([new ImageResponse($image->id, $image->getUrl())]);
        }

        return $fillingResponse;
    }
}
