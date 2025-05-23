<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property int $id
 * @property int $id_ready_cake
 * @property int $id_cake_designer
 */
class Product extends Model
{
    use HasFactory;

    public const TABLE_NAME = 'products';
    protected $table = 'products';

    public $timestamps = false;

    protected $fillable = [
        'id_cake_designer',
        'id_ready_cake'
    ];

    public function images(): BelongsToMany
    {
        return $this->belongsToMany(
            Image::class,
            ProductImageRelation::TABLE_NAME,
            'id_product',
            'id_image'
        );
    }

    public function readyCake(): BelongsTo
    {
        return $this->belongsTo(ReadyCake::class, 'id_ready_cake', 'id');
    }

    public function cakeDesigner(): BelongsTo
    {
        return $this->belongsTo(CakeDesigner::class, 'id_cake_designer', 'id');
    }
}
