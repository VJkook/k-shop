<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $id_product
 * @property int $id_image
 */
class ProductImageRelation extends Model
{
    use HasFactory;

    protected $table = 'product_image_relations';

    public $timestamps = false;

    protected $fillable = [
        'id_product',
        'id_image',
    ];
}
