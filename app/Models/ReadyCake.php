<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property int $id
 * @property string $name
 * @property float $weight
 * @property string $composition
 * @property string $description
 * @property float $price
 * @property int $id_product
 */
class ReadyCake extends Model
{
    use HasFactory;

    protected $table = 'ready_cakes';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'weight',
        'composition',
        'description',
        'price',
        'id_product'
    ];

    public function images(): BelongsToMany
    {
        return $this->belongsToMany(
            Image::class,
            'ready_cake_image_relations',
            'id_ready_cake',
            'id_image'
        );
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'id_product');
    }
}
