<?php

namespace App\Models;

use App\Models\Responses\TechnologicalMapResponse;
use Carbon\CarbonInterval;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property int $id
 * @property string $name
 * @property string $description
 * @property CarbonInterval|null $cooking_time
 */
class TechnologicalMap extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'cooking_time'
    ];

    protected $table = 'technological_maps';

    public $timestamps = false;

    protected $casts = [
        'cooking_time' => 'timestamp:' . BasicIntervalTime::TIME_FORMAT,
    ];

    public function toResponse(): TechnologicalMapResponse
    {
        $response = new TechnologicalMapResponse(
            $this->id,
            $this->name,
            $this->description,
            $this->cooking_time
        );

        /** @var CookingStep[] $steps */
        $steps = $this->steps()->get();
        $cookingStepsResponses = [];
        foreach ($steps as $step) {
            $cookingStepsResponses[] = $step->toResponse();
        }

        $response->setCookingSteps($cookingStepsResponses);

        return $response;
    }

    public function steps(): BelongsToMany
    {
        return $this->belongsToMany(
            CookingStep::class,
            TechnologicalMapCookingStepsRelation::TABLE_NAME,
            'id_technological_map',
            'id_cooking_step'
        );
    }
}
