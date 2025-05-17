<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $id
 * @property string $name
 * @property string $description
 * @property float $price
 */
class Coverage extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'id_image',
    ];

    protected $table = 'coverages';

    public $timestamps = false;

    public function image(): HasOne
    {
        return $this->hasOne(Image::class, 'id', 'id_image');
    }
}
