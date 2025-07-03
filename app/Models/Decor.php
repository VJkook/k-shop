<?php

namespace App\Models;

use App\Models\Responses\DecorResponse;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $id
 * @property string $name
 * @property string $description
 * @property float $price
 * @property int $id_image
 */
class Decor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'id_image',
    ];

    protected $table = 'decors';

    public $timestamps = false;

    public function image(): BelongsTo
    {
        return $this->belongsTo(Image::class, 'id_image', 'id');
    }

    public function recipe(): HasOne
    {
        return $this->hasOne(Recipe::class, 'id_decor', 'id');
    }

    public function toResponse(): DecorResponse
    {
        /** @var Image $image */
        $image = $this->image()->first();

        /** @var Recipe $recipe */
        $recipe = $this->recipe()->first();

        $recipeId = $recipe?->id;
        return new DecorResponse(
            $this->id,
            $this->name,
            $this->description,
            $this->price,
            $image->toResponse(),
            $recipeId
        );
    }
}
