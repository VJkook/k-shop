<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property int $id
 * @property int $id_product
 * @property int $id_user
 * @property int $count
 */
class Basket extends Model
{
    use HasFactory;

    protected $table = 'baskets';

    protected $fillable = [
        'id_product',
        'id_user',
        'count',
    ];

    public $timestamps = true;

    public function products(): BelongsTo
    {
        return $this->belongsTo(
            Product::class,
            'id_product',
            'id',
        );
    }
}
