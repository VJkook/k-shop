<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property string $measurement
 * @property float|null $quantity_in_stock
 */

class Ingredient extends Model
{
    use HasFactory;

    protected $table = 'ingredients';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'measurement',
        'quantity_in_stock'
    ];
}
