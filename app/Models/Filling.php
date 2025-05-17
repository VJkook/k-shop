<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $id
 * @property string $name
 * @property string $description
 * @property float $price_by_kg
 * @property int $id_image
 */
class Filling extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price_by_kg',
        'id_image',
    ];

    protected $table = 'fillings';

    public $timestamps = false;

    public function image(): HasOne
    {
        return $this->hasOne(Image::class, 'id', 'id_image');
    }
}
