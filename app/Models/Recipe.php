<?php

namespace App\Models;

use App\Models\Responses\Recipes\RecipeDecorResponse;
use App\Models\Responses\Recipes\RecipeFillingResponse;
use App\Models\Responses\Recipes\RecipeReadyCakeResponse;
use App\Models\Responses\TechnologicalMapResponse;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property string $name
 * @property string $description
 * @property int|null $id_ready_cake
 * @property int|null $id_filling
 * @property int|null $id_decor
 * @property int|null $id_technological_map
 */
class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'id_ready_cake',
        'id_filling',
        'id_decor',
        'id_technological_map',
    ];

    protected $table = 'recipes';

    public $timestamps = false;

    public function technologicalMap(): BelongsTo
    {
        return $this->belongsTo(TechnologicalMap::class, 'id_technological_map', 'id');
    }

    public function toRecipeReadyCakeResponse(): RecipeReadyCakeResponse
    {
        return new RecipeReadyCakeResponse(
            $this->id,
            $this->name,
            $this->description,
            $this->id_ready_cake,
            $this->getTechnologicalMapResponse()
        );
    }

    public function toRecipeDecorResponse(): RecipeDecorResponse
    {
        return new RecipeDecorResponse(
            $this->id,
            $this->name,
            $this->description,
            $this->id_decor,
            $this->getTechnologicalMapResponse(),
        );
    }

    public function toRecipeFillingResponse(): RecipeFillingResponse
    {
        return new RecipeFillingResponse(
            $this->id,
            $this->name,
            $this->description,
            $this->id_filling,
            $this->getTechnologicalMapResponse()
        );
    }

    private function getTechnologicalMapResponse(): ?TechnologicalMapResponse
    {
        /** @var TechnologicalMap $technologicalMap */
        $technologicalMap = $this->technologicalMap()->first();
        $technologicalMapResponse = null;
        if (!is_null($technologicalMap)) {
            $technologicalMapResponse = $technologicalMap->toResponse();
        }
        return $technologicalMapResponse;
    }

    public function toResponse(): RecipeFillingResponse|RecipeDecorResponse|RecipeReadyCakeResponse
    {
        if (!is_null($this->id_ready_cake)) {
            return $this->toRecipeReadyCakeResponse();
        }

        if (!is_null($this->id_decor)) {
            return $this->toRecipeDecorResponse();
        }

        return $this->toRecipeFillingResponse();
    }
}
