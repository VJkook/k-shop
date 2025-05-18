<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property string $name
 * @property string $description
 * @property float $price
 */
class Decor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'id_image',
    ];

    protected $table = 'decors';

    public $timestamps = false;

    public function image(): BelongsTo
    {
        return $this->belongsTo(Image::class, 'id_image', 'id');
    }
}
