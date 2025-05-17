<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $id
 * @property string $name
 * @property string|null $weight
 * @property float|null $total_cost
 * @property int $id_coverage
 * @property int $id_product
 */
class CakeDesigner extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price_by_kg',
        'id_image',
    ];

    protected $table = 'cakes_designers';

    public $timestamps = false;

    public function image(): HasOne
    {
        return $this->hasOne(Image::class, 'id', 'id_image');
    }

    public function images(): BelongsToMany
    {
        return $this->belongsToMany(
            Tier::class,
            ProductImageRelation::TABLE_NAME,
            'id',
            'id_image'
        );
    }
}
