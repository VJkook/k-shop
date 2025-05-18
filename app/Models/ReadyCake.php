<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $id
 * @property string $name
 * @property float $weight
 * @property string $composition
 * @property string $description
 * @property float $price
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
    ];

    public function images(): BelongsToMany
    {
        return $this->belongsToMany(
            Image::class,
            ReadyCakeImageRelation::TABLE_NAME,
            'id_ready_cake',
            'id_image'
        );
    }

    public function product(): HasOne
    {
        return $this->hasOne(Product::class, 'id_ready_cake', 'id');
    }
}
