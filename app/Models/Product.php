<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property int $id
 * @property string $name
 * @property float $weight
 * @property string $composition
 * @property string $description
 * @property float $price
 */
class Product extends Model
{
    use HasFactory;

    protected $table = 'products';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'weight',
        'composition',
        'description',
        'price',
    ];

    public function images(): BelongsToMany
    {
        return $this->belongsToMany(
            Image::class,
            'product_image_relations',
            'id_product',
            'id_image'
        );
    }
}
