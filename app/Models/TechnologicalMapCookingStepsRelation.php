<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $id_cooking_step
 * @property int $id_technological_map
 */
class TechnologicalMapCookingStepsRelation extends Model
{
    use HasFactory;

    public const TABLE_NAME = 'technological_map_cooking_steps_relations';

    protected $table = self::TABLE_NAME;

    public $timestamps = false;

    protected $fillable = [
        'id_cooking_step',
        'id_technological_map',
    ];

    public function cookingStep(): BelongsTo
    {
        return $this->belongsTo(CookingStep::class, 'id_cooking_step', 'id');
    }

    public function technologicalMap(): BelongsTo
    {
        return $this->belongsTo(TechnologicalMap::class, 'id_technological_map', 'id');
    }
}
