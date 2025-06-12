<?php

namespace App\Models;

use App\Models\Responses\CookingStepResponse;
use Carbon\CarbonInterval;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

/**
 * @property int $id
 * @property string $description
 * @property int|null $id_image
 * @property int $step_number
 * @property CarbonInterval $step_time
 */
class CookingStep extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'id_image',
        'step_number',
        'step_time',
    ];

    protected $table = 'cooking_steps';

    public $timestamps = false;

    protected $casts = [
        'step_time' => 'timestamp:' . BasicIntervalTime::TIME_FORMAT,
    ];

    public function image(): BelongsTo
    {
        return $this->belongsTo(Image::class, 'id_image', 'id');
    }

    public function toResponse(): CookingStepResponse
    {
        $response = new CookingStepResponse(
            $this->id,
            $this->description,
            $this->step_number,
            $this->step_time
        );

        /** @var Image $image */
        $image = $this->image()->first();
        if (!is_null($image)) {
            $response->setImage($image->toResponse());
        }

        return $response;
    }

    public function technologicalMap(): BelongsToMany
    {
        return $this->belongsToMany(
            TechnologicalMap::class,
            TechnologicalMapCookingStepsRelation::TABLE_NAME,
            'id_cooking_step',
            'id_technological_map'
        );
    }
}
