<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $id_product
 * @property int $id_order
 * @property int $count
 */
class ProductOrderRelation extends Model
{
    use HasFactory;

    public const TABLE_NAME = 'product_order_relations';

    protected $table = 'product_order_relations';

    public $timestamps = false;

    protected $fillable = [
        'id_product',
        'id_order',
        'count',
    ];
}
