<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property int $id
 */
class Product extends Model
{
    use HasFactory;

    public const TABLE_NAME = 'products';
    protected $table = 'products';

    public $timestamps = false;

    public function images(): BelongsToMany
    {
        return $this->belongsToMany(
            Image::class,
            ProductImageRelation::TABLE_NAME,
            'id_product',
            'id_image'
        );
    }
}
