<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property int $id
 * @property string $name
 * @property string|null $description
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
        'id_coverage',
    ];

    protected $table = 'cake_designers';

    public $timestamps = false;

    public function images(): BelongsToMany
    {
        return $this->belongsToMany(
            Image::class,
            CakeDesignerImageRelation::TABLE_NAME,
            'id_cake_designer',
            'id_image'
        );
    }
}
