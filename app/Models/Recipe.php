<?php

namespace App\Models;

use App\Models\Responses\Recipes\RecipeDecorResponse;
use App\Models\Responses\Recipes\RecipeFillingResponse;
use App\Models\Responses\Recipes\IngredientRecipeResponse;
use App\Models\Responses\Recipes\RecipeReadyCakeResponse;
use App\Models\Responses\TechnologicalMapResponse;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function ingredients(): BelongsToMany
    {
        return $this->belongsToMany(
            Ingredient::class,
            IngredientRecipeRelation::TABLE_NAME,
            'id_recipe',
            'id_ingredient'
        );
    }

    public function ingredientRecipeRelations(): HasMany
    {
        return $this->hasMany(IngredientRecipeRelation::class, 'id_recipe', 'id');
    }

    /**
     * @param IngredientRecipeResponse[] $ingredients
     * @return RecipeReadyCakeResponse
     */
    public function toRecipeReadyCakeResponse(array $ingredients = []): RecipeReadyCakeResponse
    {
        return new RecipeReadyCakeResponse(
            $this->id,
            $this->name,
            $this->description,
            $this->id_ready_cake,
            $this->getTechnologicalMapResponse(),
            $ingredients
        );
    }


    /**
     * @param IngredientRecipeResponse[] $ingredients
     * @return RecipeDecorResponse
     */
    public function toRecipeDecorResponse(array $ingredients = []): RecipeDecorResponse
    {
        return new RecipeDecorResponse(
            $this->id,
            $this->name,
            $this->description,
            $this->id_decor,
            $this->getTechnologicalMapResponse(),
            $ingredients
        );
    }

    /**
     * @param IngredientRecipeResponse[] $ingredients
     * @return RecipeFillingResponse
     */
    public function toRecipeFillingResponse(array $ingredients = []): RecipeFillingResponse
    {
        return new RecipeFillingResponse(
            $this->id,
            $this->name,
            $this->description,
            $this->id_filling,
            $this->getTechnologicalMapResponse(),
            $ingredients
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
        $ingredientRecipeRelations = $this->ingredientRecipeRelations()->get();
        $ingredients = [];

        /** @var IngredientRecipeRelation $ingredientRecipeRelation */
        foreach ($ingredientRecipeRelations as $ingredientRecipeRelation) {
            /** @var Ingredient $ingredient */
            $ingredient = $ingredientRecipeRelation->ingredient()->first();
            $ingredients[] = new IngredientRecipeResponse(
                $ingredient->id,
                $ingredient->name,
                $ingredient->measurement,
                $ingredientRecipeRelation->quantity
            );
        }

        if (!is_null($this->id_ready_cake)) {
            return $this->toRecipeReadyCakeResponse($ingredients);
        }

        if (!is_null($this->id_decor)) {
            return $this->toRecipeDecorResponse($ingredients);
        }

        return $this->toRecipeFillingResponse($ingredients);
    }
}
