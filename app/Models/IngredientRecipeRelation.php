<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property float $quantity
 * @property int $id_ingredient
 * @property int $id_recipe
 */
class IngredientRecipeRelation extends Model
{
    use HasFactory;

    public const TABLE_NAME = 'ingredient_recipe_relations';
    protected $table = self::TABLE_NAME;

    public $timestamps = false;

    protected $fillable = [
        'quantity',
        'id_ingredient',
        'id_recipe',
    ];

    public function ingredient(): BelongsTo
    {
        return $this->belongsTo(Ingredient::class, 'id_ingredient', 'id');
    }
}
