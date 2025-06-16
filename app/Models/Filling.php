<?php

namespace App\Models;

use App\Models\Responses\FillingResponse;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $id
 * @property string $name
 * @property string $description
 * @property float $price_by_kg
 * @property int|null $id_image
 */
class Filling extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price_by_kg',
        'id_image',
    ];

    protected $table = 'fillings';

    public $timestamps = false;

    public function image(): BelongsTo
    {
        return $this->belongsTo(Image::class, 'id_image', 'id');
    }

    public function recipe(): HasOne
    {
        return $this->hasOne(Recipe::class, 'id_filling', 'id');
    }

    public function toResponse(): FillingResponse
    {
        /** @var Image $image */
        $image = $this->image()->first();
        return new FillingResponse(
          $this->id,
          $this->name,
          $this->description,
          $this->price_by_kg,
          $image->toResponse(),
        );
    }
}
